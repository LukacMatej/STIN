import json
from ..sign_in.model import sign_in_model as sim
from ..sign_up.model import sign_up_model as sum

def saveRegistrationJson(su_model: sum.SignUpModel) -> None:
    with open('users.txt', 'a') as f:
        f.write(str(su_model))

def validateLogin(email_input, password_input) -> tuple[bool, sim.SignInModel]:
    sign_in_model = sim.SignInModel(email_input, password_input, 0)
    with open('users.txt', 'r') as f:
        for line in f:
            email, password, name, surname, second_password, token = line.split()
            model = sim.SignInModel(email, password, token)
            if (sign_in_model.email == email and 
                sign_in_model.password == password):
                return True, model
    return False, None

def getCurrentUser(data_user):
    with open('users.txt', 'r') as f:
        for line in f:
            email, password, name, surname, second_password, token = line.split()
            model = sim.SignInModel(email, password, id)
            if (model.token == data_user['id']):
                return model
    return None