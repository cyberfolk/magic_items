import logging

# Codici ANSI per i colori
COLORS = {
    "DEBUG": "\033[36m",  # Ciano
    "INFO": "\033[32m",  # Verde
    "WARNING": "\033[33m",  # Giallo
    "ERROR": "\033[31m",  # Rosso
    "CRITICAL": "\033[1;41m",  # Bianco su rosso
}
RESET = "\033[0m"


class ColorFormatter(logging.Formatter):
    def format(self, record):
        color = COLORS.get(record.levelname, RESET)
        message = super().format(record)
        return f"{color}{message}{RESET}"


# Configurazione logging base (una sola volta per l'intero progetto)
_handler = logging.StreamHandler()
_formatter = ColorFormatter("%(levelname)s: %(message)s")
_handler.setFormatter(_formatter)

# Evita di aggiungere duplicati se il setup è già stato eseguito
root_logger = logging.getLogger()
if not root_logger.handlers:
    logging.basicConfig(level=logging.INFO, handlers=[_handler])
else:
    # Se esistono già handler, assicurati che quello colorato sia presente
    has_color = any(isinstance(h.formatter, ColorFormatter) for h in root_logger.handlers)
    if not has_color:
        root_logger.addHandler(_handler)
