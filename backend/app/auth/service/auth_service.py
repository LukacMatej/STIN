import json
from ..sign_in.model import sign_in_model as sim
from ..sign_up.model import sign_up_model as sum

def saveRegistrationJson(su_model: sum.SignUpModel) -> None:
    with open('users.txt', 'a') as f:
        f.write(str(su_model))

def validateLogin(si_model: sim.SignInModel) -> bool:
    with open('users.txt', 'r') as f:
        for line in f:
            email, password, name, surname, second_password = line.split()
            line_model = sim.SignInModel(email, password, name, surname, second_password, id)
            if (si_model.email == line_model.email and 
                si_model.password == line_model.password):
                return True
    return False
