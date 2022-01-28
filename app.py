from flask import Flask, render_template, request, redirect #render_template로 html 파일 렌더링
from models import db, Fcuser
import os

app = Flask(__name__)

@app.route('/')
def hello():
  return "WELCOME!"

#GET = 페이지에 나오도록 요청, POST = 버튼을 눌렀을 때 데이터를 가지고 오는 요청 / 요청 정보 확인하려면 request 임포트 필요
@app.route('/register', methods=['GET','POST'])
def register():
  if request.method == 'GET':
    return render_template('index.html')
  else:
    #회원정보 생성
    userid = request.form.get('userid')
    username = request.form.get('username')
    password = request.form.get('password')
    re_password = request.form.get('re_password')
    print(password)
    # 들어오는지 확인

    if not (userid and username and password and re_password):
      return "Fill all forms"
    elif password != re_password:
      return "Check your password"
    else:
      #If everything is okay
      fcuser = Fcuser()
      fcuser.password = password
      fcuser.userid = userid
      fcuser.username = username
      db.session.add(fcuser)
      db.session.commit()
      return "Sign Up Completed"
    
    return redirect('/')

if __name__ == '__main__':
  base_dir = os.path.abspath(os.path.dirname(__file__)) #DB경로를 절대경로로 설정
  db_file = os.path.join(base_dir, 'db.sqlite') #데이터베이스 이름과 경로
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_file
  app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True #사용자에게 원하는 정보를 전달 완료했을 때를 TEARDOWN이라고 하고, 그 순간마다 COMMIT 진행하는 설정
  #여러가지 쌓여있던 동작을 Commit해서 DB에 반영시켜줌. 이러한 단위들은 트랜잭션이라고 함
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #True하면 warning메세지 유발
  
  db.init_app(app) # 초기화 후 db.app에 app으로 명시적으로 넣어줌
  db.app = app
  db.create_all() #이 명령이 있어야 DB 생성됨
  
  app.run(host='127.0.0.1', port=5000, debug=True)
  