class SignUpModel:
    def __init__(self, email: str, password: str, first_name: str, last_name: str, second_password: str) -> None:
        self.email: str = email
        self.password: str = password
        self.first_name: str = first_name
        self.last_name:str  = last_name
        self.second_password: str = second_password
        
    def __str__(self):
        return f"{self.email} {self.password} {self.first_name} {self.last_name} {self.second_password}"