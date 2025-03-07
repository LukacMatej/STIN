import logging

log_format = logging.Formatter('%(asctime)s - %(name)s - '
                               '%(levelname)s - %(message)s')
lgout = logging.StreamHandler()
lgout.setFormatter(log_format)
logger: logging.Logger = logging.getLogger("STIN-BACKEND")
logger.addHandler(lgout)
logger.setLevel(logging.DEBUG)
