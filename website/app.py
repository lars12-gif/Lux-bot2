import os
import requests
import streamlit as st

API = os.getenv("LUX_API_URL", "http://localhost:8080").rstrip("/")
st.set_page_config(page_title="Lux Bot | منصة لوكس", page_icon="👑", layout="wide")

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
html, body, [class*="css"] { direction: rtl; text-align: right; font-family: Cairo, sans-serif; }
.stApp { background: radial-gradient(circle at top right,#252014 0,#0a0a0b 42%,#050505 100%); color:#f3ead5; }
section[data-testid="stSidebar"] { background:#101010; border-left:1px solid #6d592c; }
h1,h2,h3 { color:#d9bd79 !important; }
div.stButton>button { background:#b8954b; color:#090909; border:0; border-radius:10px; font-weight:800; }
div.stButton>button:hover { background:#e1c77f; color:#000; }
.lux-card { background:#141414; border:1px solid #6b5528; border-radius:16px; padding:18px; margin:8px 0; }
small { color:#b6a77e; }
</style>
""", unsafe_allow_html=True)

def call(method, path, payload=None, auth=True):
    headers = {}
    if auth and st.session_state.get("token"):
        headers["Authorization"] = "Bearer " + st.session_state["token"]
    try:
        r = requests.request(method, API + path, json=payload, headers=headers, timeout=20)
        data = r.json() if r.content else {}
        if r.status_code >= 400:
            st.error(data.get("error", "حدث خطأ في الاتصال بالخادم."))
            return None
        return data
    except requests.RequestException:
        st.error("تعذر الاتصال بخادم المنصة. تحقق من رابط API.")
        return None

def logout():
    st.session_state.clear()
    st.rerun()

st.markdown("<h1 style='text-align:center'>👑 LUX BOT</h1><p style='text-align:center;color:#d9bd79'>منصة لوكس لإدارة بوتات واتساب</p>", unsafe_allow_html=True)

if not st.session_state.get("token"):
    tab_login, tab_register = st.tabs(["تسجيل الدخول", "إنشاء حساب"])
    with tab_login:
        with st.form("login"):
            username = st.text_input("اسم المستخدم")
            password = st.text_input("كلمة المرور", type="password")
            submitted = st.form_submit_button("دخول")
        if submitted:
            result = call("POST", "/api/auth/login", {"username": username, "password": password}, False)
            if result:
                st.session_state["token"] = result["token"]
                st.session_state["username"] = result["user"]["username"]
                st.rerun()
    with tab_register:
        with st.form("register"):
            new_user = st.text_input("اسم المستخدم (أحرف إنجليزية وأرقام)")
            new_pass = st.text_input("كلمة المرور (10 أحرف على الأقل)", type="password")
            confirm = st.text_input("تأكيد كلمة المرور", type="password")
            submitted = st.form_submit_button("إنشاء حساب")
        if submitted:
            if new_pass != confirm:
                st.error("كلمتا المرور غير متطابقتين.")
            else:
                result = call("POST", "/api/auth/register", {"username": new_user, "password": new_pass}, False)
                if result:
                    st.session_state["token"] = result["token"]
                    st.session_state["username"] = result["user"]["username"]
                    st.rerun()
    st.stop()

with st.sidebar:
    st.markdown("### 👑 لوحة لوكس")
    st.write("مرحباً،", st.session_state.get("username", ""))
    page = st.radio("القائمة", ["الرئيسية", "ربط واتساب", "إدارة الأوامر"])
    st.button("تسجيل الخروج", on_click=logout)

if page == "الرئيسية":
    st.subheader("لوحة التحكم")
    status = call("GET", "/api/whatsapp/status") or {}
    state = status.get("status", "not_started")
    labels = {"not_started":"غير مشغّل","starting":"قيد التشغيل","running":"عملية البوت تعمل","error":"يوجد خطأ","stopped":"متوقف"}
    a,b,c = st.columns(3)
    a.metric("حالة البوت", labels.get(state, state))
    b.metric("عملية الخادم", "تعمل" if status.get("processRunning") else "متوقفة")
    c.metric("اسم المنصة", "Lux Bot")
    st.info(status.get("details", "اربط رقم واتساب من صفحة ربط واتساب للبدء."))
    st.markdown('<div class="lux-card"><h3>تنبيه الخصوصية</h3>كل حساب له مجلد جلسة منفصل. لا تشارك رمز الاقتران أو ملفات الجلسة مع أي شخص.</div>', unsafe_allow_html=True)

elif page == "ربط واتساب":
    st.subheader("ربط رقم واتساب برمز الاقتران")
    st.write("أدخل رقمك مع مفتاح الدولة، مثال: 9647XXXXXXXXX")
    with st.form("pair"):
        phone = st.text_input("رقم واتساب الدولي", placeholder="9647XXXXXXXXX")
        submit = st.form_submit_button("إنشاء رمز الاقتران")
    if submit:
        result = call("POST", "/api/whatsapp/connect", {"phone": phone})
        if result:
            st.success("تم بدء طلب الربط. أكمل الخطوات من تطبيق واتساب.")
            st.code(result["pairingCode"], language=None)
            st.write(result["instructions"])
    st.warning("لا تدخل رقم شخص آخر دون إذنه. استخدم الرمز بنفسك من تطبيق واتساب الرسمي.")

elif page == "إدارة الأوامر":
    st.subheader("تشغيل وتعطيل إضافات البوت")
    commands = call("GET", "/api/commands")
    if commands is not None:
        grouped = {}
        for item in commands:
            grouped.setdefault(item["category"], []).append(item)
        for category, items in grouped.items():
            with st.expander(category, expanded=False):
                for item in items:
                    col1, col2 = st.columns([4,1])
                    col1.write(item["name"])
                    value = col2.toggle("مفعّل", value=item["enabled"], key="cmd_"+item["id"], label_visibility="collapsed")
                    if value != item["enabled"]:
                        call("PATCH", "/api/commands/"+item["id"], {"enabled": value})
                        st.rerun()
