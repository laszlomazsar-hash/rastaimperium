from core.codex_engine import CodexEngine


def emergency_freeze(engine: CodexEngine) -> dict:
    for sandbox in engine.sandboxes:
        sandbox.agent.set_status("frozen")
    return engine.audit_state()
