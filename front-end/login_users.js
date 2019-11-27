$("#login_btn").click(function(event) {
    var obj = new Object();
    obj["nombre"] = $("#user_login").val();
    obj["contraseña"] = $("#contraseña_login").val()
    $.when(conexion("Usuarios", "login", obj)).done(function(res) {
        if (res.ResultSet[0].id == "error") {
            alert("Clave incorrecta");
        } else {
            if (res.ResultSet[0].id == "no existe") {
                alert("Usuario inexistente");
            } else {
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("user", res.ResultSet[0].id);
                    window.location.href = "index_users.html";
                } else {
                    alert("The browser you are currently using does not support the latest version of HTML5, please select another one and try again");
                }
            }
        }
    });
});

$(window).keypress(function(event) {
    if(event.which == 13){
        $("#login_btn").trigger('click');
    }
});