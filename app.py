import os
from flask import Flask
from flask import request
from flask import redirect
from flask import render_template
from models import db
from models import Fcuser

from flask_wtf.csrf import CSRFProtect
from forms import RegisterForm

app = Flask(__name__)

@app.route('/register', methods=['GET','POST']) #Get,Pos 둘다 사용
def register():
  form = RegisterForm()
  if form.validate_on_submit(): # POST 검사의 유효성 검사가 정상적으로 되었는지 확인할 수 있다. 
    fcuser = Fcuser() #models.py에 있는 Fcuser 클래스
    fcuser.userid = form.data.get('userid')
    fcuser.username = form.data.get('username')
    fcuser.password = form.data.get('password')
    fcuser.email = form.data.get('email')
    
    db.session.add(fcuser)
    db.session.commit()
    
    return "Sign up completed"
  return render_template('index.html', form=form)

@app.route('/')
def hello():
  return "Hello"

if __name__ == '__main__':
  base_dir = os.path.abspath(os.path.dirname(__file__))
  db_file = os.path.join(base_dir, 'db.sqlite')
  
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_file #sqlite를 사용(만약 mysql 사용한다면 더 필요한게 많음)
  app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True #사용자 요청의 끝마다 커밋(데이터베이스에 푸시)
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #수정사항에 대해 Track하지 않음. True일시 warning 메세지 유발
  app.config['SECRET_KEY'] = 'wcsfeufhwiquehfdx'
  
  csrf = CSRFProtect()
  csrf.init_app(app)
  
  db.init_app(app)
  db.app = app
  db.create_all() # DB 생성
  
  app.run(host='127.0.0.1', port=5000, debug=True)
  # 기본 5000포트, debug = true