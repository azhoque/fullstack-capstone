const state = {
  projects: [],
  project: null
};
$(function() {
  renderPage();
  $(".button-collapse").sideNav();
  $("#jsForm").submit(function(event) {
    event.preventDefault();
    const newEntry = $("#jsForm").val();
    $("#jsForm").val("");
    var errors = validateFormFields();
    var hasError = errors[0];
    var errorMessage = errors[1];
    if (hasError){
      $("#errorMessage").text(errorMessage);
    }
    else {
      const newProject = {
      id: state.projects.length,
      date: $("#jsDate").val(),
      project: $("#jsProject").val(),
      recentStatus: $("#jsStatus").val(),
      pm: $("#jsPm").val(),
      release: $("#jsRelease").val(),
      share: $("#jsShare").val()
      };
      state.projects.push(newProject);
      postDataFromApi(newProject, () => {
      renderListItem();
      });
      console.log(state);
    }
  });
  function validateFormFields (){
    var hasError = false;
    var errorMessage = ""
    $('#jsForm input').each(function(){
      if($(this).val() == ''){
        hasError = true;
        errorMessage = "Please fill out all the fields.";
      }
    });
    var errors = [hasError, errorMessage];
    return errors;
}
  $("#jsEditForm").submit(function(event) {
    event.preventDefault();
    $("#jsEditForm").val("");
    state.project.date = $("#edit-date").val();
    state.project.recentStatus = $("#edit-status").val();
    state.project.share = $("#edit-team").val();
    if (!state.project.statusHistory) {
      state.project.statusHistory = [];
    }

    state.project.statusHistory.push({
      message: state.project.recentStatus,
      date: state.project.date
    });
    putDataFromApi(state.project, () => {
      renderListItem();
    });

    $("#container3").hide();
  });

  $("#jsForm").on("click", "#jsCancel", event => {
    $("#container1").show();
    $("#container2").hide();
  });

  $("#jsEditForm").on("click", "#jsCancel2", event => {
    $("#container1").show();
    $("#container3").hide();
  });
  $("#jsBack").click(event => {
    $("#container1").show();
    $("#container4").hide();
  });
  $("#jsCancel3").click(event => {
    $("#container1").show();
    $("#signup-container").hide();
  });

  //register and log-in
  $("#reg-link").click(function() {
    $("#signup-container").show();
    $("#container1").hide();
    $("#container2").hide();
    $("#login-container").hide();
    $("#container4").hide();
    $("#container3").hide();
    $("#about-container").hide();
  });
  $("#reg-link2").click(function() {
    $("#signup-container").show();
    $("#container1").hide();
    $("#container2").hide();
    $("#login-container").hide();
    $("#container4").hide();
    $("#container3").hide();
    $("#about-container").hide();
  });
  $("#log-link").click(function() {
    $("#signup-container").hide();
    $("#login-container").show();
    $("#container1").hide();
    $("#container2").hide();
    $("#container4").hide();
    $("#about-container").hide();
  });
  $("#about-link").click(function() {
    $("#signup-container").hide();
    $("#login-container").hide();
    $("#container1").hide();
    $("#container2").hide();
    $("#container4").hide();
    $("#about-container").show();
  });
  $("#about-link2").click(function() {
    $("#signup-container").hide();
    $("#login-container").hide();
    $("#container1").hide();
    $("#container2").hide();
    $("#container4").hide();
    $("#about-container").show();
  });

  $("#home-link").click(function() {
    renderPage();
  });
  $("#home-link2").click(function() {
    renderPage();
  });
  //native JS method
  let isLoggedIn = localStorage.getItem("token");
  if (isLoggedIn) {
    $("#reg-link").hide();
    $("#log-link").hide();
    $("#sign-out").show();
  }
  let isLoggedIn2 = localStorage.getItem("token");
  if (isLoggedIn2) {
    $("#reg-link2").hide();
    $("#log-link2").hide();
    $("#sign-out2").show();
  }
});

$("#sign-out").click(function() {
  localStorage.removeItem("token"); //native js method
  location.reload();
});
$("#sign-out2").click(function() {
  localStorage.removeItem("token"); //native js method
  location.reload();
});
$("#jsRegister").click(function() {
  let username = $("#rName").val();
  console.log(username);
  let useremail = $("#rEmail").val();
  console.log(useremail);
  let userpass = $("#rPass").val();
  console.log(userpass);

  var newUser = { email: useremail, username: username, password: userpass };
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: "https://shrouded-lowlands-90709.herokuapp.com/register",
    //url: "http://localhost:8080/register",
    data: JSON.stringify(newUser),
    success: function(data) {
      console.log(data);
      localStorage.setItem("token", data);
      location.reload();
    }
  });
});
$("#jsLogIn").click(function() {
  let username = $("#lName").val();
  console.log(username);
  let userpass = $("#lPass").val();
  console.log(userpass);

  var newUser = { username: username, password: userpass };
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: "https://shrouded-lowlands-90709.herokuapp.com/login",
    //url: "http://localhost:8080/login",
    data: JSON.stringify(newUser),
    success: function(data) {
      console.log(data);
      localStorage.setItem("token", data);
      location.reload();
    }
  });
});

function handleDeleteClick() {
  console.log("handleclicked");
  console.log(state.project);
  deleteDataFromApi(state.project.id, state.project, () => {
    location.reload();
  });
}
function renderListItem() {
  $("#jsReport").html("");
  state.projects.forEach(addProject => {
    const newItem = `<tr>
            <td>${addProject.date}</td>
            <td>${addProject.project}</td>
            <td>${addProject.recentStatus}</td>
            <td>${addProject.pm}</td>
            <td>${addProject.release}</td>
            <td>${addProject.share}</td>
            
            <td>
            <button type= "button" title="EDIT" class="btn-floating waves-effect light-green darken-1 waves-light" id="jsEdit"><i class="material-icons">mode_edit</i></button>
            <button type= "button" title="DETAIL" class="btn-floating waves-effect light-green darken-1 waves-light" id="jsDetail"><i class="material-icons">assessment</i></button>
            <button type= "button" title="DELETE" class="btn-floating waves-effect red lighten-1 center-align" id="jsDelete"><i class="material-icons">clear</i></button>
            
            </td>
            </tr>`;
    const newItemJs = $(newItem);
    newItemJs.find("#jsEdit").click(function() {
      event.preventDefault();
      $("#container1").hide();
      $("#container2").hide();
      $("#container3").show();
      $("#edit-date").val(addProject.date);
      $("#edit-status").val(addProject.recentStatus);
      $("#edit-team").val(addProject.share);
      state.project = addProject;
    });
    newItemJs.find("#jsDelete").click(function() {
      console.log("deleteclicked");
      state.project = addProject;
      handleDeleteClick();
    });
    newItemJs.find("#jsDetail").click(function() {
      console.log("detail click");
      state.project = addProject;
      console.log(state.project);
      $("#container1").hide();
      $("#container2").hide();
      $("#container3").hide();
      $("#container4").show();
      $("#about-container").hide();
      renderStatusList();
    });

    $("#jsReport").append(newItemJs);
  });
  $("#container1").show();
  $("#container2").hide();
}

function renderStatusList() {
  $("#jsProjectDetails").html("");
  state.project.statusHistory.forEach(addStatus => {
    const newStatus = `<tr>
    <td>${addStatus.date}</td>
    <td>${addStatus.message}</td>
    </tr>`;
    const newStatusJs = $(newStatus);
    $("#jsProjectDetails").append(newStatusJs);
  });
}

function renderPage() {
  $("#container1").show();
  $("#container2").hide();
  $("#container3").hide();
  $("#container4").hide();
  $("#signup-container").hide();
  $("#login-container").hide();
  $("#about-container").hide();

  $("#jsCreate").click(function() {
    $("#container1").hide();
    $("#container3").hide();
    $("#container2").show();
    $("#container4").hide();
    $("#signup-container").hide();
    $("#login-container").hide();
    $("#about-container").hide();
  });

  getDataFromApi(function(projects) {
    state.projects = projects;
    renderListItem();
  });
}

function getDataFromApi(callback) {
  const settings = {
    url: "https://shrouded-lowlands-90709.herokuapp.com/projects",
    //url: "http://localhost:8080/projects",
    contentType: "application/json",

    type: "GET",
    success: callback
  };

  $.ajax(settings);
}

function postDataFromApi(projectData, callback) {
  const settings = {
    url: "https://shrouded-lowlands-90709.herokuapp.com/projects",
    //url: "http://localhost:8080/projects",
    contentType: "application/json",
    data: JSON.stringify(projectData),
    type: "POST",
    success: callback
  };

  $.ajax(settings);
}

function deleteDataFromApi(projectId, projectData, callback) {
  const settings = {
    url: "https://shrouded-lowlands-90709.herokuapp.com/projects/" + projectId,
    //url: "http://localhost:8080/projects/" + projectId,
    contentType: "application/json",
    data: JSON.stringify(projectData),
    type: "DELETE",
    success: callback
  };

  $.ajax(settings);
}

function putDataFromApi(projectData, callback) {
  const settings = {
    url: "https://shrouded-lowlands-90709.herokuapp.com/projects/" + projectData.id,
    //url: "http://localhost:8080/projects/" + projectData.id,
    contentType: "application/json",
    data: JSON.stringify(projectData),
    type: "PUT",
    success: callback
  };

  $.ajax(settings);
}
