// Implementation C — Go
// Built from public algorithm specification only (ALGORITHM.md / capsule fields).
// Not a port of Node or Python verifiers.
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

func jsonString(s string) string {
	// RFC 8259 minimal escaping — do NOT HTML-escape < >
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
			return nil, fmt.Errorf("illegal transition %s->%s", from, to)
		}
		next["lifecycle_state"] = to
	case "COMMIT_FINALIZED":
		next["commit_finalized"] = true
	default:
		return nil, fmt.Errorf("unsupported event_type %s", et)
	}
	return next, nil
}

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "usage: verify_art_l7_replay_001 <ART-L7-REPLAY-001.json>")
		os.Exit(1)
	}
	raw, err := os.ReadFile(os.Args[1])
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	var cap map[string]interface{}
	if err := json.Unmarshal(raw, &cap); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	if cap["artifactId"] != "ART-L7-REPLAY-001" {
		fmt.Fprintln(os.Stderr, "unexpected artifactId")
		os.Exit(1)
	}
	events, _ := cap["events"].([]interface{})
	init, _ := cap["initial_state"].(map[string]interface{})
	run := func() (map[string]interface{}, error) {
		b, _ := json.Marshal(init)
		var st map[string]interface{}
		_ = json.Unmarshal(b, &st)
		for _, ev := range events {
			em, _ := ev.(map[string]interface{})
			var err error
			st, err = apply(st, em)
			if err != nil {
				return nil, err
			}
		}
		return st, nil
	}
	a, err1 := run()
	b, err2 := run()
	if err1 != nil || err2 != nil {
		fmt.Println(`{"implementation":"go","pass":false}`)
		os.Exit(1)
	}
	shaA := sha(canon(a))
	shaB := sha(canon(b))
	head := "GENESIS"
	for _, ev := range events {
		head = sha(head + "|" + canon(ev))
	}
	receiptPayload := map[string]interface{}{
		"version_bundle":     cap["version_bundle"],
		"event_count":        float64(len(events)),
		"state_hash":         shaA,
		"ledger_head_hash":   head,
		"terminal_lifecycle": a["lifecycle_state"],
		"commit_finalized":   a["commit_finalized"],
	}
	receiptHash := sha(canon(receiptPayload))
	exp, _ := cap["expected"].(map[string]interface{})
	pass := shaA == shaB &&
		shaA == exp["state_hash"] &&
		head == exp["ledger_head_hash"] &&
		receiptHash == exp["receipt_hash"] &&
		a["lifecycle_state"] == exp["terminal_lifecycle"] &&
		a["commit_finalized"] == exp["commit_finalized"]
	out := map[string]interface{}{
		"implementation": "go",
		"artifactId":     "ART-L7-REPLAY-001",
		"pass":           pass,
		"computed": map[string]string{
			"state_hash":       shaA,
			"receipt_hash":     receiptHash,
			"ledger_head_hash": head,
		},
	}
	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	_ = enc.Encode(out)
	if !pass {
		os.Exit(1)
	}
}
