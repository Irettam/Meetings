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
import org.ietf.jgss.Oid;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author Tomas
 */
public class Clientes {

    private int id;
    private String nombre;
    private String usuario;
    private String contrasena;
    private String mail;
    private Oid logo;
    private Oid bandera;
    private Oid foto_persona;
    private boolean activo;
    final private static String tabla = "clientes";

    public Clientes(int id, String nombre, String usuario, String contrasena, String mail, Oid logo, Oid bandera, Oid foto_persona, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.mail = mail;
        this.logo = logo;
        this.bandera = bandera;
        this.foto_persona = foto_persona;
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

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public Oid getLogo() {
        return logo;
    }

    public void setLogo(Oid logo) {
        this.logo = logo;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public Oid getBandera() {
        return bandera;
    }

    public void setBandera(Oid bandera) {
        this.bandera = bandera;
    }

    public Oid getFoto_persona() {
        return foto_persona;
    }

    public void setFoto_persona(Oid foto_persona) {
        this.foto_persona = foto_persona;
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
        switch (llamada.getAction()) {
            case "select":
                Gson g2 = new Gson();
                ResultSet rs = Clientes.select();
                Clientes cliente2 = g2.fromJson(data, Clientes.class);
                while (rs.next()) {
                    JSONObject line = new JSONObject();
                    if (rs.getBoolean("activo") && cliente2.getId() != rs.getInt("id")) {
                        line.put("id", rs.getInt("id"));
                        line.put("nombre", rs.getString("nombre"));
                        //line.put("contraseña", rs.getString("contrasena"));
                        line.put("activo", "");
                        arr.add(line);
                    }
                }
                obj.put("ResultSet", arr);
                rs.close();
                break;
            case "login":
                boolean hayDatos = false;
                Gson g = new Gson();
                Clientes cliente = g.fromJson(data, Clientes.class);
                ResultSet res = Tabla.select(tabla, "usuario='" + cliente.getNombre() + "'");
                while (res.next()) {
                    JSONObject line = new JSONObject();
                    if (res.getString("contrasena").equals(cliente.getContrasena())) {
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
                } else {
                    JSONObject line = new JSONObject();
                    line.put("id", "no existe");
                    arr.add(line);
                    obj.put("ResultSet", arr);
                }
                res.close();
                break;
            case "getAll":
                Gson g3 = new Gson();
                ResultSet rs3 = Clientes.select();
                Clientes cliente3 = g3.fromJson(data, Clientes.class);
                while (rs3.next()) {
                    JSONObject line = new JSONObject();
                    line.put("id", rs3.getInt("id"));
                    line.put("nombre", rs3.getString("nombre"));
                    //line.put("contraseña", rs.getString("contrasena"));
                    line.put("activo", rs3.getBoolean("activo"));
                    arr.add(line);

                }
                obj.put("ResultSet", arr);
                rs3.close();
                break;
        }
        return obj;
    }

    public static int insert(int id, String nombre, String usuario, String contrasena, Oid logo) {
        String campos = "id,nombre,contrasena,email,anulado";
        String valores = id + ",'" + nombre + "','" + usuario + "','" + contrasena + "'," + logo;
        return Tabla.insert(tabla, campos, valores);
    }

    public void Guardar() {
        Clientes.insert(this.id, this.nombre, this.usuario, this.contrasena, this.logo);

    }

    public static int updateAll(int id, String nombre, String contrasena, String email, boolean activo) {
        String campos = "id<>nombre<>contrasena<>email<>anulado";
        String valores = id + "<>'" + nombre + "'<>'" + contrasena + "'<>'" + email + "'<>" + activo;
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
