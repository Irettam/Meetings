/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package clases;

import com.google.gson.Gson;
import db.Tabla;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.text.ParseException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author Tomas
 */
public class Conexiones {

    private int id;
    private int id_cliente1;
    private int id_cliente2;
    private boolean validacion_1;
    private boolean validacion_2;
    private String horario_inicio;
    private String horario_final;
    private String fecha;
    private int mesa;
    private int mesa_num;
    private final static String tabla = "conexiones";

    public Conexiones(int id, int id_cliente1, int id_cliente2, boolean validacion_1, boolean validacion_2, String horario_inicio, String horario_final, String fecha, int mesa, int mesa_num) {
        this.id = id;
        this.id_cliente1 = id_cliente1;
        this.id_cliente2 = id_cliente2;
        this.validacion_1 = validacion_1;
        this.validacion_2 = validacion_2;
        this.horario_inicio = horario_inicio;
        this.horario_final = horario_final;
        this.fecha = fecha;
        this.mesa = mesa;
        this.mesa_num = mesa_num;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId_cliente1() {
        return id_cliente1;
    }

    public void setId_cliente1(int id_cliente1) {
        this.id_cliente1 = id_cliente1;
    }

    public int getId_cliente2() {
        return id_cliente2;
    }

    public void setId_cliente2(int id_cliente2) {
        this.id_cliente2 = id_cliente2;
    }

    public boolean isValidacion_1() {
        return validacion_1;
    }

    public void setValidacion_1(boolean validacion_1) {
        this.validacion_1 = validacion_1;
    }

    public boolean isValidacion_2() {
        return validacion_2;
    }

    public void setValidacion_2(boolean validacion_2) {
        this.validacion_2 = validacion_2;
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

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public int getMesa() {
        return mesa;
    }

    public void setMesa(int mesa) {
        this.mesa = mesa;
    }

    public int getMesa_num() {
        return mesa_num;
    }

    public void setMesa_num(int mesa_num) {
        this.mesa_num = mesa_num;
    }

    public static JSONObject dispatcher(Llamada llamada, String data) throws SQLException, ParseException {
        JSONObject obj = new JSONObject();
        JSONArray arr = new JSONArray();
        switch (llamada.getAction()) {
            case "select":
                Gson g2 = new Gson();
                Conexiones conexion = g2.fromJson(data, Conexiones.class);
                ResultSet rs = Tabla.executeThis("select conexiones.id, conexiones.id_cliente1, conexiones.id_cliente2, clientes.nombre, conexiones.horario_inicio, conexiones.horario_final, conexiones.fecha, conexiones.mesa, conexiones.mesa_num from conexiones inner join clientes on conexiones.id_cliente2=clientes.id where (conexiones.id_cliente1=" + conexion.getId() + " or conexiones.id_cliente2=" + conexion.getId() + ") and conexiones.validacion_1=true and conexiones.validacion_2=true");
                while (rs.next()) {
                    JSONObject line = new JSONObject();
                    line.put("id", rs.getInt("id"));
                    line.put("id_cliente2", rs.getInt("id_cliente2"));
                    line.put("nombre", rs.getString("nombre"));
                    line.put("horario_inicio", rs.getString("horario_inicio"));
                    line.put("horario_final", rs.getString("horario_final"));
                    line.put("fecha", rs.getString("fecha"));
                    line.put("mesa", rs.getInt("mesa_num"));
                    arr.add(line);
                }
                obj.put("ResultSet", arr);
                rs.close();
                Tabla.close();
                break;
            case "select_confirm":
                Gson g3 = new Gson();
                Conexiones conexion2 = g3.fromJson(data, Conexiones.class);
                ResultSet rs2 = Tabla.executeThis("select conexiones.id, conexiones.id_cliente1, conexiones.id_cliente2, clientes.nombre, conexiones.horario_inicio, conexiones.horario_final, conexiones.fecha, conexiones.mesa, conexiones.mesa_num from conexiones inner join clientes on conexiones.id_cliente2=clientes.id where conexiones.id_cliente2=" + conexion2.getId() + "and conexiones.validacion_1=true and conexiones.validacion_2=false");
                while (rs2.next()) {
                    JSONObject line = new JSONObject();
                    line.put("id", rs2.getInt("id"));
                    line.put("id_cliente2", rs2.getInt("id_cliente2"));
                    line.put("nombre", rs2.getString("nombre"));
                    line.put("horario_inicio", rs2.getString("horario_inicio"));
                    line.put("horario_final", rs2.getString("horario_final"));
                    line.put("fecha", rs2.getString("fecha"));
                    line.put("mesa", rs2.getInt("mesa_num"));
                    line.put("activo", "");
                    arr.add(line);
                }
                obj.put("ResultSet", arr);
                rs2.close();
                Tabla.close();
                break;
            case "select_pending":
                Gson g5 = new Gson();
                Conexiones conexion5 = g5.fromJson(data, Conexiones.class);
                ResultSet rs5 = Tabla.executeThis("select conexiones.id, conexiones.id_cliente1, conexiones.id_cliente2, clientes.nombre, conexiones.horario_inicio, conexiones.horario_final, conexiones.fecha, conexiones.mesa, conexiones.mesa_num from conexiones inner join clientes on conexiones.id_cliente2=clientes.id where conexiones.id_cliente1=" + conexion5.getId() + "and conexiones.validacion_1=true and conexiones.validacion_2=false");
                while (rs5.next()) {
                    JSONObject line = new JSONObject();
                    line.put("id", rs5.getInt("id"));
                    line.put("id_cliente2", rs5.getInt("id_cliente2"));
                    line.put("nombre", rs5.getString("nombre"));
                    line.put("horario_inicio", rs5.getString("horario_inicio"));
                    line.put("horario_final", rs5.getString("horario_final"));
                    line.put("fecha", rs5.getString("fecha"));
                    line.put("mesa", rs5.getInt("mesa_num"));
                    line.put("activo", "");
                    arr.add(line);
                }
                obj.put("ResultSet", arr);
                rs5.close();
                Tabla.close();
                break;
            case "save":
                Gson g = new Gson();
                Conexiones conexion3 = g.fromJson(data, Conexiones.class);
                Conexiones.update(conexion3.getId(), "validacion_2", "true");
                obj.put("Resultset", "true");
                break;
            case "create":
                Gson g4 = new Gson();
                Conexiones conexion4 = g4.fromJson(data, Conexiones.class);
                ResultSet rs4 = Tabla.executeThis("select min(id) as id from mesas where dia='" + conexion4.getFecha() + "' and horario_inicio='" + conexion4.getHorario_inicio() + "' and horario_final='" + conexion4.getHorario_final() + "' and ocupado=false and id_lugar=(select max(id) from lugar)");
                if (rs4.next()) {
                    conexion4.setId(Tabla.UltimoNumero(tabla) + 1);
                    int id_mesa = rs4.getInt("id");
                    conexion4.setMesa(id_mesa);
                    rs4.close();
                    ResultSet rsn = Tabla.select("mesas", "id=" + id_mesa);
                    rsn.next();
                    conexion4.setMesa_num(rsn.getInt("numero"));
                    rsn.close();
                    conexion4.Guardar();
                    Mesas.update(id_mesa, "ocupado", "true");
                    obj.put("Resultset", "true");
                } else {
                    obj.put("Resultset", "false");
                }
                rs4.close();
                break;
            case "horarios":
                ResultSet rs3 = Tabla.executeThis("select dia,horario_inicio, horario_final from mesas where ocupado = false group by dia,horario_inicio,horario_final order by dia,horario_inicio");
                while (rs3.next()) {
                    JSONObject line = new JSONObject();
                    line.put("dia", rs3.getString("dia"));
                    line.put("horario_inicio", rs3.getString("horario_inicio"));
                    line.put("horario_final", rs3.getString("horario_final"));
                    arr.add(line);
                }
                obj.put("ResultSet", arr);
                rs3.close();
                break;
            case "decline":
                Gson g6 = new Gson();
                Conexiones conexion6 = g6.fromJson(data, Conexiones.class);
                ResultSet rs6 = Conexiones.select("id=" + conexion6.getId());
                int mesa_id = 0;
                while (rs6.next()) {
                    mesa_id = rs6.getInt("mesa");
                }
                rs6.close();
                Tabla.executeThis("delete from conexiones where id=" + conexion6.getId());
                Mesas.update(mesa_id, "ocupado", "false");
                obj.put("ResultSet", arr);
                break;
            case "getAll":
                ResultSet rsc7 = Tabla.executeThis("select * from conexiones");
                while (rsc7.next()) {
                    System.out.println(rsc7.getInt("id"));
                    JSONObject line = new JSONObject();
                    line.put("id_cliente1", rsc7.getInt("id_cliente1"));
                    line.put("id_cliente2", rsc7.getInt("id_cliente2"));
                    line.put("id", rsc7.getInt("id"));
                    line.put("horario_inicio", rsc7.getString("horario_inicio"));
                    line.put("horario_final", rsc7.getString("horario_final"));
                    line.put("fecha", rsc7.getString("fecha"));
                    line.put("mesa", rsc7.getInt("mesa_num"));
                    arr.add(line);
                }
                obj.put("ResultSet", arr);
                rsc7.close();
                break;
        }
        return obj;
    }

    public static int insert(int id, int id_cliente1, int id_cliente2, boolean validacion_1, boolean validacion_2, String horario_inicio, String horario_final, String fecha, int mesa, int mesa_num) {
        String campos = "id,id_cliente1,id_cliente2,validacion_1,validacion_2,horario_inicio,horario_final,fecha,mesa,mesa_num";
        String valores = (Tabla.UltimoNumero(tabla) + 1) + "," + id_cliente1 + "," + id_cliente2 + "," + validacion_1 + "," + validacion_2 + ",'" + horario_inicio + "','" + horario_final + "','" + fecha + "'," + mesa + "," + mesa_num;
        return Tabla.insert(tabla, campos, valores);
    }

    public void Guardar() {
        Conexiones.insert(this.id, this.id_cliente1, this.id_cliente2, this.validacion_1, this.validacion_2, this.horario_inicio, this.horario_final, this.fecha, this.mesa, this.mesa_num);
    }

    public static int updateAll(int id, int id_cliente1, int id_cliente2, boolean validacion_1, boolean validacion_2, String horario_inicio, String horario_final, String fecha, int mesa, int mesa_num) {
        String campos = "id,id_cliente1,id_cliente2,validacion_1,validacion_2,horario_inicio,horario_final,fecha,mesa,mesa_num";
        String valores = id + "<>" + id_cliente1 + "<>" + id_cliente2 + "<>" + validacion_1 + "<>" + validacion_2 + "<>'" + horario_inicio + "'<>'" + horario_final + "'<>'" + fecha + "'<>" + mesa + "<>" + mesa_num;
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

    public static ResultSet select(String filtro) {
        return Tabla.select(tabla, filtro);
    }
}
