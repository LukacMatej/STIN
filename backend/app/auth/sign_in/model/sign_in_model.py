class SignInModel:
    def __init__(self, email: str, password: str, token: int):
        self.email: str = email
        self.password: str = password
        self.token: int = token