from flask import jsonify
# Helper function to create ResponseEntity-like responses
def create_response_entity(data=None, status_code=200, message=None, error=None):
    """
    Creates a Flask response with specified data, status code, message, and error.

    Args:
        data (any, optional): Data to include in the response. Defaults to None.
        status_code (int, optional): HTTP status code. Defaults to 200.
        message (str, optional): A message to include in the response. Defaults to None.
        error (str, optional): An error message to include in the response. Defaults to None.

    Returns:
        tuple: A tuple containing the JSON response and the HTTP status code.
    """
    response_body = {}
    if data is not None:
        response_body["data"] = data
    if message is not None:
        response_body["message"] = message
    if error is not None:
        response_body["error"] = error

    return jsonify(response_body), status_code