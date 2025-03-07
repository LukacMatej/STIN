class SignInModel:
    def __init__(self, email: str, password: str, id: int):
        self.email: str = email
        self.password: str = password
        self.id: int = id