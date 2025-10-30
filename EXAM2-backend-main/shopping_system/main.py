from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import sqlite3
import logging
import re
import os

app = Flask(__name__)
app.secret_key = "1234"   # 必須設置 session key

# === 資料庫連線 ===
def get_db_connection():
    db_path = os.path.join(os.path.dirname(__file__), 'shopping_data.db')
    if not os.path.exists(db_path):
        logging.error(f"Database file not found at {db_path}")
        return None
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


# === 註冊頁面與功能 ===
@app.route('/page_register', methods=['GET', 'POST'])
def page_register():
    if request.method == 'POST':
        data = request.get_json(silent=True) or request.form
        username = (data.get('username') or '').strip()
        password = (data.get('password') or '').strip()
        email = (data.get('email') or '').strip()

        # ===== 規則驗證 =====
        # 帳號不可空
        if not username:
            return jsonify({"status": "error", "message": "帳號不得為空"})

        # 密碼至少 8 碼，且包含大小寫英文
        if len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'[a-z]', password):
            return jsonify({"status": "error", "message": "密碼必須超過8個字元且包含英文大小寫，重新輸入"})

        # Email 格式檢查
        if not re.match(r'^[A-Za-z0-9._%+-]+@gmail\.com$', email):
            return jsonify({"status": "error", "message": "Email 格式不符重新輸入"})

        # ===== 寫入資料庫 =====
        conn = get_db_connection()
        if conn is None:
            return jsonify({"status": "error", "message": "資料庫連線失敗"})
        cur = conn.cursor()

        # 檢查帳號是否存在
        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        exists = cur.fetchone()

        if exists:
            # 帳號已存在 → 修改密碼或信箱
            cur.execute("UPDATE users SET password = ?, email = ? WHERE username = ?",
                        (password, email, username))
            conn.commit()
            conn.close()
            return jsonify({"status": "exists_updated", "message": "帳號已存在，成功修改密碼或信箱"})

        # 新增帳號
        cur.execute("INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
                    (username, password, email))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "註冊成功"})

    # 預設載入 HTML
    return render_template('page_register.html')


# === 登入驗證函式 ===
def login_user(username, password):
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM user_table WHERE username = ? AND password = ?", (username, password))
            user = cursor.fetchone()
            if user:
                return {"status": "success", "message": "Login successful"}
            else:
                return {"status": "error", "message": "帳號或密碼錯誤"}
        except sqlite3.Error as e:
            logging.error(f"Database query error: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            conn.close()
    else:
        return {"status": "error", "message": "Database connection error"}


# === 登入頁面與功能 ===
@app.route('/page_login', methods=['GET', 'POST'])
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


# === 登出功能 ===
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('page_login'))


# === 首頁（登入後導向） ===
@app.route('/index')
def index():
    if 'username' not in session:
        return redirect(url_for('page_login'))
    return render_template('index.html')


# === 啟動 Flask ===
if __name__ == '__main__':
    app.run(debug=True)
