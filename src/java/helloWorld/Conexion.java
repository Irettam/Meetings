/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package helloWorld;

import clases.Clientes;
import clases.Conexiones;
import clases.Excel;
import clases.Llamada;
import clases.Lugar;
import clases.Usuarios;
import com.google.gson.Gson;
import java.sql.SQLException;
import org.json.simple.JSONObject;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import static javax.ws.rs.HttpMethod.POST;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import util.Log;

/**
 * REST Web Service
 *
 * @author Tomas
 */
@Path("Conexion")
public class Conexion {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of helloWorld
     */
    public Conexion() {

    }

    /**
     * Retrieves representation of an instance of helloWorld.helloWorld
     *
     * @param data
     * @return an instance of java.lang.String
     * @throws org.json.simple.parser.ParseException
     */
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces("application/json")
    @Path("{data}")
    public Response getJSON(@PathParam("data") String data) throws ParseException, SQLException, java.text.ParseException {
        Gson g = new Gson();
        Llamada llamada = g.fromJson(data, Llamada.class);
        JSONObject obj = new JSONObject();
        Gson json = new Gson();
        switch (llamada.getController()) {
            case "Lugar":
                obj = Lugar.dispatcher(llamada, data);
                break;
            case "Usuarios":
                obj = Usuarios.dispatcher(llamada, data);
                break;
            case "Clientes":
                obj = Clientes.dispatcher(llamada, data);
                break;
            case "Conexiones":
                obj = Conexiones.dispatcher(llamada, data);
                break;
            default:
                obj.put("Resultset", "Controller inexistente");

        }
        //obj.put("Resultset", obj);
        return Response.status(200).entity(obj).header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "API, CRUNCHIFYGET, GET, POST, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Max-Age", "151200")
                .header("Access-Control-Allow-Headers", "x-requested-with,Content-Type")
                .build();
    }

    /**
     * PUT method for updating or creating an instance of helloWorld
     *
     * @param data representation for the resource
     * @return
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces("application/json")
    //@Path("{data}")
    @Path("/post")
    public Response postHtml(String data) throws SQLException, java.text.ParseException {
        /*JSONObject obj = new JSONObject();
        obj.put("webService", data);*/
        Gson g = new Gson();
        Llamada llamada = g.fromJson(data, Llamada.class);
        JSONObject obj = new JSONObject();
        Gson json = new Gson();
        switch (llamada.getController()) {
            case "Lugar":
                obj = Lugar.dispatcher(llamada, data);
                break;
            case "Usuarios":
                obj = Usuarios.dispatcher(llamada, data);
                break;
            case "Clientes":
                obj = Clientes.dispatcher(llamada, data);
                break;
            case "Conexiones":
                obj = Conexiones.dispatcher(llamada, data);
                break;
            case "Excel":
                Excel.LeerExcel();
                obj.put("Resultset", "Clients Uploaded");
                break;
            default:
                obj.put("Resultset", "Controller inexistente");

        }
        return Response.status(200).entity(obj).header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "API, CRUNCHIFYGET, GET, POST, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Max-Age", "151200")
                .header("Access-Control-Allow-Headers", "x-requested-with,Content-Type")
                .build();
    }
}
