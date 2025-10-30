from flask import Flask, request, jsonify, render_template, session, redirect, url_for, flash
from datetime import datetime
import sqlite3
import logging
import re 
import os


app = Flask(__name__)

# 路徑修改
def get_db_connection():
    conn = sqlite3.connect('./shopping_data.db')
    if not os.path.exists('./shopping_data.db'):
        logging.error(f"Database file not found at {''}")
        return None
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    return conn   

# 補齊空缺程式碼
@app.route('/page_login_' , methods=['GET', 'POST'])
def page_login():
    try:
        if request.method == 'POST':
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
            result = login_user(username, password)
            if result["status"] == "success":
                session['username'] = username
            return jsonify(result)
        return render_template('page_login_.html')
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/page_register', methods=['GET', 'POST'])
def page_register():
    if request.method == 'POST':
        data = request.get_json(silent=True) or request.form  # 同時支援 JSON / form
        username = (data.get('username') or '').strip()
        password = (data.get('password') or '').strip()
        email    = (data.get('email') or '').strip()

        # 伺服端再檢查一次（避免只靠前端）
        if len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'[a-z]', password):
            return jsonify({"status": "error", "message": "密碼必須超過8個字元且包含英文大小寫，重新輸入"})

        if not re.match(r'^[A-Za-z0-9._%+-]+@gmail\.com$', email):
            return jsonify({"status": "error", "message": "Email 格式不符重新輸入"})

        conn = get_db_connection()
        if conn is None:
            return jsonify({"status": "error", "message": "Database connection error"})
        cur = conn.cursor()

        
        cur.execute("SELECT 1 FROM users WHERE username = ?", (username,))
        exists = cur.fetchone()

        if exists:
            # 題目第 5 點：帳號已存在 → 修改密碼或信箱
            cur.execute("UPDATE users SET password = ?, email = ? WHERE username = ?",
                        (password, email, username))
            conn.commit()
            conn.close()
            return jsonify({"status": "exists_updated", "message": "帳號已存在，成功修改密碼或信箱"})

        # 新增
        cur.execute("INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
                    (username, password, email))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "註冊成功"})

    return render_template('page_register.html')



def login_user(username, password):
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
            user = cursor.fetchone()
            if user:
                return {"status": "success", "message": "Login successful"}
            else:
                return {"status": "error", "message": "Invalid username or password"}
        except sqlite3.Error as e:
            logging.error(f"Database query error: {e}")
            return {"status": "error", "message": "An error occurred"}
        finally:
            conn.close()
    else:
        return {"status": "error", "message": "Database connection error"}

@app.route('/index')
def index():
    if 'username' not in session:
        return redirect(url_for('page_login'))
    return render_template('index.html')



# 補齊剩餘副程式
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('page_login'))

# 補齊空缺程式碼
if __name__ == '__main__':
    app.run(debug=True)


