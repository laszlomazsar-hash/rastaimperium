// Implementation C — Go (reject path)
// From public algorithm only. Not a port of Node/Python.
package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"strings"
)

type illegalError struct {
	From, To string
}

func (e *illegalError) Error() string {
	return fmt.Sprintf("illegal transition %s->%s", e.From, e.To)
}

func jsonString(s string) string {
	var b strings.Builder
	b.WriteByte('"')
	for _, r := range s {
		switch r {
		case '"', '\\':
			b.WriteByte('\\')
			b.WriteRune(r)
		case '\b':
			b.WriteString(`\b`)
		case '\f':
			b.WriteString(`\f`)
		case '\n':
			b.WriteString(`\n`)
		case '\r':
			b.WriteString(`\r`)
		case '\t':
			b.WriteString(`\t`)
		default:
			if r < 0x20 {
				b.WriteString(fmt.Sprintf(`\u%04x`, r))
			} else {
				b.WriteRune(r)
			}
		}
	}
	b.WriteByte('"')
	return b.String()
}

func canon(v interface{}) string {
	switch x := v.(type) {
	case nil:
		return "null"
	case bool:
		if x {
			return "true"
		}
		return "false"
	case float64:
		if x == float64(int64(x)) {
			return fmt.Sprintf("%d", int64(x))
		}
		b, _ := json.Marshal(x)
		return string(b)
	case string:
		return jsonString(x)
	case []interface{}:
		s := "["
		for i, e := range x {
			if i > 0 {
				s += ","
			}
			s += canon(e)
		}
		return s + "]"
	case map[string]interface{}:
		keys := make([]string, 0, len(x))
		for k := range x {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		s := "{"
		for i, k := range keys {
			if i > 0 {
				s += ","
			}
			s += jsonString(k) + ":" + canon(x[k])
		}
		return s + "}"
	default:
		b, _ := json.Marshal(x)
		return string(b)
	}
}

func sha(s string) string {
	h := sha256.Sum256([]byte(s))
	return hex.EncodeToString(h[:])
}

func allowed(from, to string) bool {
	if to == "CONTESTED" {
		return true
	}
	m := map[string]map[string]bool{
		"INGESTED":   {"NORMALIZED": true},
		"NORMALIZED": {"VERIFIED": true},
		"VERIFIED":   {"CORRELATED": true},
		"CORRELATED": {"ARCHIVED": true},
	}
	return m[from][to]
}

func apply(state map[string]interface{}, event map[string]interface{}) (map[string]interface{}, error) {
	b, _ := json.Marshal(state)
	var next map[string]interface{}
	_ = json.Unmarshal(b, &next)
	et, _ := event["event_type"].(string)
	switch et {
	case "RECORD_INSERT":
		rid, _ := event["record_id"].(string)
		recs, _ := next["records"].(map[string]interface{})
		if recs == nil {
			recs = map[string]interface{}{}
			next["records"] = recs
		}
		if _, exists := recs[rid]; exists {
			return nil, fmt.Errorf("duplicate record_id")
		}
		recs[rid] = event["payload"]
	case "STATE_TRANSITION":
		from, _ := next["lifecycle_state"].(string)
		to, _ := event["to_state"].(string)
		if !allowed(from, to) {
			return nil, &illegalError{From: from, To: to}
		}
		next["lifecycle_state"] = to
	case "COMMIT_FINALIZED":
		next["commit_finalized"] = true
	default:
		return nil, fmt.Errorf("unsupported")
	}
	return next, nil
}

func main() {
	if len(os.Args) < 2 {
		os.Exit(1)
	}
	raw, err := os.ReadFile(os.Args[1])
	if err != nil {
		os.Exit(1)
	}
	var cap map[string]interface{}
	if err := json.Unmarshal(raw, &cap); err != nil {
		os.Exit(1)
	}
	if cap["artifactId"] != "ART-L7-REJECT-001" {
		fmt.Println(`{"pass":false}`)
		os.Exit(1)
	}
	events, _ := cap["events"].([]interface{})
	init, _ := cap["initial_state"].(map[string]interface{})
	b, _ := json.Marshal(init)
	var state map[string]interface{}
	_ = json.Unmarshal(b, &state)

	rejIdx := 0
	fromS, toS, rejMsg := "", "", ""
	rejected := false
	for i, ev := range events {
		em, _ := ev.(map[string]interface{})
		ns, err := apply(state, em)
		if err != nil {
			rejected = true
			rejIdx = i
			if ie, ok := err.(*illegalError); ok {
				fromS, toS = ie.From, ie.To
				rejMsg = ie.Error()
			} else {
				rejMsg = err.Error()
			}
			break
		}
		state = ns
	}
	if !rejected {
		fmt.Println(`{"pass":false,"reason":"no rejection"}`)
		os.Exit(1)
	}
	stateBeforeHash := sha(canon(state))
	head := "GENESIS"
	for _, ev := range events {
		head = sha(head + "|" + canon(ev))
	}
	receipt := map[string]interface{}{
		"version_bundle":        cap["version_bundle"],
		"event_count":           float64(len(events)),
		"rejection_index":       float64(rejIdx),
		"rejection_code":        "ILLEGAL_TRANSITION",
		"rejection_message":     rejMsg,
		"from_state":            fromS,
		"to_state":              toS,
		"state_before_hash":     stateBeforeHash,
		"attempted_ledger_head": head,
		"state_mutated":         false,
	}
	receiptHash := sha(canon(receipt))
	exp, _ := cap["expected"].(map[string]interface{})
	pass := stateBeforeHash == exp["state_before_hash"] &&
		head == exp["attempted_ledger_head"] &&
		receiptHash == exp["receipt_hash"] &&
		fromS == exp["from_state"] &&
		toS == exp["to_state"] &&
		rejMsg == exp["rejection_message"]
	out := map[string]interface{}{
		"implementation": "go",
		"artifactId":     "ART-L7-REJECT-001",
		"pass":           pass,
		"computed": map[string]string{
			"state_before_hash":     stateBeforeHash,
			"attempted_ledger_head": head,
			"receipt_hash":          receiptHash,
			"rejection_message":     rejMsg,
		},
	}
	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	_ = enc.Encode(out)
	if !pass {
		os.Exit(1)
	}
}
