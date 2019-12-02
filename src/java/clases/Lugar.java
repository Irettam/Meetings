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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
//import java.util.concurrent.DateUnit;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author Tomas
 */
public class Lugar {

    private int id;
    private String nombre;
    private String direccion;
    private String pais;
    private boolean activo;
    private int mesas;
    private String horario_inicio;
    private String horario_final;
    private int tiempo_reunion;
    private String dia_inicio;
    private String dia_final;
    private final static String tabla = "lugar";

    public Lugar(int id, String nombre, String direccion, String pais, boolean activo, int mesas, String horario_inicio, String horario_final, int tiempo_reunion, String dia_inicio, String dia_final) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.pais = pais;
        this.activo = activo;
        this.mesas = mesas;
        this.horario_inicio = horario_inicio;
        this.horario_final = horario_final;
        this.tiempo_reunion = tiempo_reunion;
        this.dia_inicio = dia_inicio;
        this.dia_final = dia_final;
    }

    public int getMesas() {
        return mesas;
    }

    public void setMesas(int mesas) {
        this.mesas = mesas;
    }

    public String getHorario_inicio() {
        return horario_inicio;
    }

    public void setHorario_inicio(String horario_inicio) {
        this.horario_inicio = horario_inicio;
    }

    public String getHorario_final() {
        return horario_final;
    }

    public void setHorario_final(String horario_final) {
        this.horario_final = horario_final;
    }

    public int getTiempo_reunion() {
        return tiempo_reunion;
    }

    public void setTiempo_reunion(int tiempo_reunion) {
        this.tiempo_reunion = tiempo_reunion;
    }

    public String getDia_inicio() {
        return dia_inicio;
    }

    public void setDia_inicio(String dia_inicio) {
        this.dia_inicio = dia_inicio;
    }

    public String getDia_final() {
        return dia_final;
    }

    public void setDia_final(String dia_final) {
        this.dia_final = dia_final;
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

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public static JSONObject dispatcher(Llamada llamada, String data) throws SQLException, ParseException {
        JSONObject obj = new JSONObject();
        JSONArray arr = new JSONArray();
        switch (llamada.getAction()) {
            case "select":
                Gson g2 = new Gson();
                ResultSet rs = Lugar.select();
                Lugar lugar = g2.fromJson(data, Lugar.class);
                while (rs.next()) {
                    JSONObject line = new JSONObject();

                    line.put("id", rs.getInt("id"));
                    line.put("nombre", rs.getString("nombre"));
                    //line.put("contraseña", rs.getString("contrasena"));
                    line.put("activo", "");
                    arr.add(line);

                }
                obj.put("ResultSet", arr);
                rs.close();
                break;
            case "save":
                Gson g = new Gson();
                ResultSet res = Lugar.select();
                Lugar lugar2 = g.fromJson(data, Lugar.class);
                lugar2.Guardar();
                Date desde_date = new SimpleDateFormat("dd/MM/yyyy").parse(lugar2.getDia_inicio().replace("-", "/"));
                Date hasta_date = new SimpleDateFormat("dd/MM/yyyy").parse(lugar2.getDia_final().replace("-", "/"));
                long diff = hasta_date.getTime() - desde_date.getTime();

                int dias = (int) (diff / (1000 * 60 * 60 * 24));
                dias++;

                //DateTimeFormatter  df = DateTimeFormatter.ofPattern("hh:mm:ss");
                LocalTime desde_hora = LocalTime.parse(lugar2.getHorario_inicio());
                LocalTime hasta_hora = LocalTime.parse(lugar2.getHorario_final());
                //LocalDateTime min = LocalDateTime.parse("00:15:00",df);
                Duration duration = Duration.between(desde_hora, hasta_hora);
                long cant = duration.toMinutes() / lugar2.tiempo_reunion;
                LocalTime desde = desde_hora;
                LocalTime hasta = desde_hora.plusMinutes(lugar2.tiempo_reunion);
                LocalDateTime dia = desde_date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                int id_lugar = Tabla.UltimoNumero("lugar");
                int id_mesa = Tabla.UltimoNumero("mesas");
                Tabla.connect();
                while (dias > 0) {
                    long rep = cant;
                    while (cant > 0) {
                        for (int i = 0; i < lugar2.mesas; i++) {
                            id_mesa++;
                            Mesas mesa = new Mesas(id_mesa, desde.toString(), hasta.toString(), false, i + 1, dia.toString(), id_lugar);
                            mesa.GuardarMuchos();
                        }
                        desde = desde.plusMinutes(lugar2.tiempo_reunion);
                        hasta = hasta.plusMinutes(lugar2.tiempo_reunion);
                        cant--;
                    }
                    desde = desde_hora;
                    hasta = desde_hora.plusMinutes(lugar2.tiempo_reunion);
                    cant = rep;
                    dia = dia.plusDays(1);
                    dias--;
                }
                Tabla.close();
                res.close();
                obj.put("Resultset", "true");
                break;
            case "BorrarMesa":
                Tabla.deleteAll(tabla);
                obj.put("Result", "Mesas borradas");
                break;
            case "BorrarLugares":
                Tabla.deleteAll(tabla);
                obj.put("Result", "Lugares borrados");
                break;
        }
        return obj;
    }

    public static int insert(int id, String nombre, String direccion, String pais, boolean activo, int mesas, String horario_inicio, String horario_final, int tiempo_reunion, String dia_inicio, String dia_final) {
        String campos = "id,nombre,direccion,pais,activo,mesas,horario_inicio,horario_final,tiempo_reunion,dia_inicio,dia_final";
        String valores = (Tabla.UltimoNumero(tabla) + 1) + ",'" + nombre + "','" + direccion + "','" + pais + "'," + activo + "," + mesas + ",'" + horario_inicio + "','" + horario_final + "'," + tiempo_reunion + ",'" + dia_inicio + "','" + dia_final + "'";
        return Tabla.insert(tabla, campos, valores);
    }

    public void Guardar() {
        Lugar.insert(this.id, this.nombre, this.direccion, this.pais, this.activo, this.mesas, this.horario_inicio, this.horario_final, this.tiempo_reunion, this.dia_inicio, this.dia_final);
    }

    public static int updateAll(int id, String nombre, String direccion, String pais, boolean activo, int mesas, String horario_inicio, String horario_final, int tiempo_reunion, String dia_inicio, String dia_final) {
        String campos = "id<>nombre<>direccion<>pais<>activo<>mesas<>horario_inicio<>horario_final<>tiempo_reunion<>dia_inicio<>dia_final";
        String valores = id + "<>'" + nombre + "'<>'" + direccion + "'<>'" + pais + "'<>" + activo + "<>" + mesas + "<>'" + horario_inicio + "'<>'" + horario_final + "'<>" + tiempo_reunion + "<>'" + dia_inicio + "'<>'" + dia_final + "'";
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
