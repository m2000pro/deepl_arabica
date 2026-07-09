from flask import Blueprint, request, jsonify
from database import get_db_connection

diag_bp = Blueprint('diagnosticos', __name__)

@diag_bp.route('/guardar', methods=['POST', 'OPTIONS'])
def guardar_diagnostico():
    if request.method == 'OPTIONS': return '', 200
    data = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """INSERT INTO diagnosticos 
                    (usuario_id, parcela_id, resultado, enfermedad, confianza, recomendacion, foto_url, fecha_hora) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())"""
            cursor.execute(sql, (
                data.get('usuario_id'), 
                data.get('parcela_id'), 
                data.get('resultado'), 
                data.get('enfermedad'), 
                data.get('confianza'),
                data.get('recomendacion', ''),
                data.get('foto_url', '')
            ))
        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Diagnóstico guardado en BD exitosamente'}), 201
    except Exception as e:
        print(f"❌ ERROR CRÍTICO DE MYSQL: {str(e)}")
        return jsonify({'error': str(e)}), 500

@diag_bp.route('/historial/usuario/<int:usuario_id>', methods=['GET', 'OPTIONS'])
def obtener_historial(usuario_id):
    if request.method == 'OPTIONS': return '', 200
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # MAGIA AQUÍ: Usamos %% para que Python no confunda el formato de fecha
            sql = """SELECT id, DATE_FORMAT(fecha_hora, '%%d/%%m/%%Y') as fecha, 
                            resultado as diagnostico, enfermedad, parcela_id as parcela, 
                            confianza, recomendacion, foto_url
                    FROM diagnosticos 
                    WHERE usuario_id = %s 
                    ORDER BY fecha_hora DESC"""
            cursor.execute(sql, (usuario_id,))
            
            columnas = [columna[0] for columna in cursor.description]
            registros = [dict(zip(columnas, fila)) for fila in cursor.fetchall()]
            
        conn.close()
        return jsonify(registros), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500