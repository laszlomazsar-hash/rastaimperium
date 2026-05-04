from app.core.container import get_container


def get_evolutionary_optimizer():
    return get_container().evolutionary_optimizer


def get_field_controller():
    return get_container().field_controller
