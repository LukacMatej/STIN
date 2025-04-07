class UserModel:
    def __init__(self, first_name: str, last_name: str, email: str, password: str, second_password: str, token: str):
        self.first_name: str = first_name
        self.last_name: str = last_name
        self.email: str = email
        self.password: str = password
        self.second_password: str = second_password
        self.token: str = token

    def __repr__(self):
        return (f"<UserModel(first_name='{self.first_name}', last_name='{self.last_name}', "
                f"email='{self.email}')>")
