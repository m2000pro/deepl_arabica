from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
# Permitimos CORS explícitamente para todo el dominio (Angular)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ==========================================
# CONFIGURACIÓN DE BASE DE DATOS TiDB (AWS)
# ==========================================
DB_HOST = 'gateway01.us-east-1.prod.aws.tidbcloud.com'
DB_PORT = 4000
DB_USER = '48vN34SyuVsmZoq.root'
DB_PASSWORD = 'kWXlqgNGbN2MqHKB' 
DB_NAME = 'deepl_arabica'

def get_db_connection():
    return pymysql.connect(
        host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PASSWORD,
        database=DB_NAME, cursorclass=pymysql.cursors.DictCursor,
        ssl={"ssl_verify_cert": False}
    )

# ==========================================
# RUTAS PARA AGRICULTORES (Usuarios Normales)
# ==========================================
@app.route('/api/auth/registro', methods=['POST', 'OPTIONS'])
def registro_usuario():
    if request.method == 'OPTIONS': return '', 200
    datos = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # Encriptamos la contraseña del agricultor
            password_encriptada = generate_password_hash(datos['password'])
            sql = """INSERT INTO usuarios 
                (nombre_completo, usuario, correo_electronico, contrasena) 
                VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (datos['nombre_completo'], datos['usuario'], datos['correo_electronico'], password_encriptada))
        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Usuario registrado con éxito'}), 201
    except pymysql.err.IntegrityError:
        return jsonify({'error': 'El usuario o correo ya existe'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login_usuario():
    if request.method == 'OPTIONS': return '', 200
    datos = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, nombre_completo, usuario, contrasena FROM usuarios WHERE usuario = %s", (datos['usuario'],))
            usuario_db = cursor.fetchone()
        conn.close()

        # Comparamos el hash guardado contra el password enviado
        if usuario_db and check_password_hash(usuario_db['contrasena'], datos['password']):
            return jsonify({
                'mensaje': 'Login exitoso',
                'usuario': {
                    'id': usuario_db['id'],
                    'nombre_completo': usuario_db['nombre_completo'],
                    'usuario': usuario_db['usuario'],
                    'rol': 'USER'
                }
            }), 200
        else:
            return jsonify({'error': 'Credenciales incorrectas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================================
# RUTAS PARA ADMINISTRADORES (Cueva de Batman)
# ==========================================
@app.route('/api/auth/admin-login', methods=['POST', 'OPTIONS'])
def admin_login():
    if request.method == 'OPTIONS': return '', 200
    data = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # Buscamos en la tabla exclusiva de administradores
            cursor.execute("SELECT * FROM administradores WHERE usuario = %s", (data['usuario'],))
            admin = cursor.fetchone()
        conn.close()
        
        # Validación con hash para el administrador
        if admin and check_password_hash(admin['contrasena'], data['contrasena']):
            return jsonify({'message': 'Login exitoso', 'usuario': admin}), 200
        return jsonify({'error': 'Credenciales incorrectas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================================
# RUTAS DEL PANEL DE CONTROL
# ==========================================
@app.route('/api/admin/usuarios', methods=['GET', 'OPTIONS'])
def listar_usuarios():
    if request.method == 'OPTIONS': return '', 200
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, nombre_completo, usuario, correo_electronico, estado FROM usuarios")
            usuarios = cursor.fetchall()
        conn.close()
        return jsonify(usuarios), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/cambiar-estado', methods=['POST', 'OPTIONS'])
def cambiar_estado():
    if request.method == 'OPTIONS': return '', 200
    data = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("UPDATE usuarios SET estado = %s WHERE id = %s", (data['estado'], data['id']))
        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Estado actualizado'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================================
# RUTAS DE DIAGNÓSTICOS (Guardar en Historial)
# ==========================================
@app.route('/api/diagnosticos/guardar', methods=['POST', 'OPTIONS'])
def guardar_diagnostico():
    if request.method == 'OPTIONS': return '', 200
    data = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """INSERT INTO diagnosticos 
                    (usuario_id, parcela_id, resultado, enfermedad, confianza,fecha_hora) 
                    VALUES (%s, %s, %s, %s, %s,NOW())"""
            cursor.execute(sql, (
                data['usuario_id'], 
                data['parcela_id'], 
                data['resultado'], 
                data['enfermedad'], 
                data['confianza']
            ))
        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Diagnóstico guardado en BD exitosamente'}), 201
    except Exception as e:
        print(f"❌ ERROR CRÍTICO DE MYSQL: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)