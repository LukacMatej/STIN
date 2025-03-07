import random

class SignUpModel:
    def __init__(self, email: str, password: str, first_name: str, last_name: str, second_password: str) -> None:
        self.email: str = email
        self.password: str = password
        self.first_name: str = first_name
        self.last_name:str  = last_name
        self.second_password: str = second_password
        self.id: int = self.generateId()
        
    def __str__(self):
        return f"{self.email} {self.password} {self.first_name} {self.last_name} {self.second_password} {self.id}"
    
    def generateId(self) -> int:
        # Ensure the ID is unique by checking against existing IDs
        existing_ids = set()  # This should be replaced with actual storage of IDs
        new_id = random.randint(1000, 9999)
        while new_id in existing_ids:
            new_id = random.randint(1000, 9999)
            existing_ids.add(new_id)
        return new_id