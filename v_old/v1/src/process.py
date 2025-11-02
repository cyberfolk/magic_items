import logging
from .price import get_magic_item_price
from .naming import get_item_name

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")


def process_item(obj: dict):
    try:
        costo = get_magic_item_price(obj)
        nome = get_item_name(obj)
        craft = costo * 0.5 * 0.75
        px = craft / 25
        logging.info(f"{nome + ' →':80} | PB {costo:6} | CRAFT {craft} | PX {px} |")
        return nome, costo
    except ValueError as e:
        logging.error(f"Errore di validazione: {e}")
    except Exception as e:
        logging.error(f"Errore imprevisto: {e}")
    return None
