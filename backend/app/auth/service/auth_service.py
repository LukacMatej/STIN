import json
from ..sign_in.model import sign_in_model as sim
from ..sign_up.model import sign_up_model as sum
from ..user.model import user_model as um
import jwt

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

def getUserByEmail(email: str) -> um.UserModel | None:
    with open('users.txt', 'r') as f:
        for line in f:
            user_email, password, name, surname, second_password, token = line.split()
            if user_email == email:
                return um.UserModel(first_name=name, last_name=surname, email=user_email, password=password, second_password=second_password, token=token)
    return None

def getCurrentUser(secret_key: str, data_user: dict) -> sim.SignInModel | None:
    try:
        decoded_token = jwt.decode(data_user['token'], secret_key, algorithms=["HS256"])
        user_email = decoded_token.get('email')
        with open('users.txt', 'r') as f:
            for line in f:
                email, password, _, _, _, token = line.split()
                if email == user_email:
                    return sim.SignInModel(email, password, token)
    except jwt.ExpiredSignatureError:
        print("Token has expired")
    except jwt.InvalidTokenError:
        print("Invalid token")
    
    return None