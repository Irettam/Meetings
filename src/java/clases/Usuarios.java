/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package clases;

import com.google.gson.Gson;
import db.Tabla;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author Tomas
 */
public class Usuarios {

    private int id;
    private String nombre;
    private String contraseña;
    private boolean activo;
    private final static String tabla = "usuarios";

    public Usuarios(String nombre, String contraseña, boolean activo) {
        this.nombre = nombre;
        this.contraseña = contraseña;
        this.activo = activo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public static JSONObject dispatcher(Llamada llamada, String data) throws SQLException {
        JSONObject obj = new JSONObject();
        JSONArray arr = new JSONArray();
        JSONObject line = new JSONObject();
        switch (llamada.getAction()) {
            case "select":
                ResultSet rs = Usuarios.select();
                //JSONObject line = new JSONObject();
                while (rs.next()) {
                    line.put("id", rs.getInt("id"));
                    line.put("nombre", rs.getString("nombre"));
                    line.put("contraseña", rs.getString("contrasena"));
                    line.put("activo", rs.getBoolean("activo"));
                    arr.add(line);
                    //line.clear();
                }
                obj.put("ResultSet", arr);
                rs.close();
                break;
            case "login":
                boolean hayDatos = false;
                Gson g = new Gson();
                Usuarios user = g.fromJson(data, Usuarios.class);
                ResultSet res = Tabla.select(tabla, "nombre='" + user.getNombre() + "'");
                while (res.next()) {
                    if (res.getString("contrasena").equals(user.getContraseña())) {
                        line.put("id", res.getInt("id"));
                        arr.add(line);
                    } else {
                        line.put("id", "error");
                        arr.add(line);
                    }
                    hayDatos = true;
                }
                if (hayDatos) {
                    obj.put("ResultSet", arr);
                }else{
                    line.put("id", "no existe");
                    arr.add(line);
                    obj.put("ResultSet", arr);
                }
                res.close();
        }
        return obj;
    }

    public static int insert(int id, String nombre, String contraseña, boolean activo) {
        String campos = "id,nombre,contrasena,activo";
        String valores = (Tabla.UltimoNumero(tabla) + 1) + ",'" + nombre + "','" + contraseña + "'," + activo;
        return Tabla.insert(tabla, campos, valores);
    }

    public void Guardar() {
        Usuarios.insert(this.id, this.nombre, this.contraseña, this.activo);

    }

    public static int updateAll(int id, String nombre, String direccion, String pais, boolean activo) {
        String campos = "id<>nombre<>direccion<>pais<>activo";
        String valores = id + "<>'" + nombre + "'<>'" + direccion + "'<>'" + pais + "'<>" + activo;
        return Tabla.updateAll(tabla, id, campos, valores);
    }

    public static int delete(int id) {
        return Tabla.delete(tabla, id);
    }

    public static int update(int id, String campo, String valor) {
        return Tabla.update(tabla, id, campo, valor);
    }

    public static ResultSet select() {
        return Tabla.select(tabla);
    }

}
