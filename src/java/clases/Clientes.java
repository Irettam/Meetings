/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package clases;

import com.google.gson.Gson;
import db.Tabla;
import java.sql.Blob;
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
    private String contacto;
    private String pais;
    private Oid logo;
    private Object bandera;
    private Oid foto_persona;
    private boolean activo;
    final private static String tabla = "clientes";

    public Clientes(int id, String nombre, String usuario, String contrasena, String mail, Oid logo, Object bandera, Oid foto_persona, boolean activo, String contacto) {
        this.id = id;
        this.nombre = nombre;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.contacto = contacto;
        this.mail = mail;
        this.logo = logo;
        this.bandera = bandera;
        this.foto_persona = foto_persona;
        this.activo = activo;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getContacto() {
        return contacto;
    }

    public void setContacto(String contacto) {
        this.contacto = contacto;
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

    public Object getBandera() {
        return bandera;
    }

    public void setBandera(Object bandera) {
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
                Tabla.close();
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
                        line.put("nombre", res.getString("nombre"));
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
            case "save":
                Gson g4 = new Gson();
                Clientes cliente4 = g4.fromJson(data, Clientes.class);
                System.out.println("bandera");
                cliente4.updateAllCliente(cliente4.getId(), cliente4.getBandera(), cliente4.getContacto(), cliente4.getPais(), cliente4.getMail());
                //cliente4.updateAllCliente(cliente4.getId(), cliente4.getBandera(), cliente4.getContacto(), cliente4.getFoto_persona(), cliente4.getPais(), cliente4.getMail());
                JSONObject line = new JSONObject();
                line.put("id", "hice algo!!!!!");
                arr.add(line);
                break;
            case "getCliente":
                boolean hayDatos2 = false;
                Gson g5 = new Gson();
                Clientes cliente5 = g5.fromJson(data, Clientes.class);
                ResultSet res5 = Tabla.select(tabla, "id=" + cliente5.getId() + "");
                while (res5.next()) {
                    JSONObject line5 = new JSONObject();
                    line5.put("id", res5.getInt("id"));
                    line5.put("nombre", res5.getString("nombre"));
                    line5.put("bandera", res5.getObject("flag"));
                    line5.put("contacto", res5.getString("contacto"));
                    line5.put("pais", res5.getString("pais"));
                    line5.put("mail", res5.getString("mail"));
                    arr.add(line5);
                    hayDatos2 = true;
                }
                if (hayDatos2) {
                    obj.put("ResultSet", arr);
                } else {
                    JSONObject line5 = new JSONObject();
                    line5.put("id", "no existe");
                    arr.add(line5);
                    obj.put("ResultSet", arr);
                }
                res5.close();
                Tabla.close();
                break;
        }
        return obj;
    }

    public static int insert(int id, String nombre, String usuario, String contrasena, Oid logo, String contacto) {
        String campos = "id,nombre,contrasena,email,anulado";
        String valores = id + ",'" + nombre + "','" + usuario + "','" + contrasena + "'," + logo + "','" + contacto + "'";
        return Tabla.insert(tabla, campos, valores);
    }

    public void Guardar() {
        Clientes.insert(this.id, this.nombre, this.usuario, this.contrasena, this.logo, this.contacto);

    }

    public static int updateAll(int id, String nombre, String contrasena, String email, boolean activo) {
        String campos = "id<>nombre<>contrasena<>email<>anulado";
        String valores = id + "<>'" + nombre + "'<>'" + contrasena + "'<>'" + email + "'<>" + activo;
        return Tabla.updateAll(tabla, id, campos, valores);
    }

    /* public static int updateAllCliente(int id, String bandera, String contacto, Oid foto_persona, String pais, String mail) {
        String campos = "id<>bandera<>contacto<>foto_persona<>pais<>mail";
        String valores = id + "<>'" + bandera + "<>'" + contacto + "'<>'" + foto_persona + "'<>'" + pais + mail + "'<>";
        return Tabla.updateAll(tabla, id, campos, valores);
    }*/
    public static int updateAllCliente(int id, Object bandera, String contacto, String pais, String mail) {
        String campos = "id<>flag<>contacto<>pais<>mail";
        String valores = id + "<>'" + bandera + "'<>'" + contacto + "'<>'" + pais + "'<>'" + mail + "'<>";
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
