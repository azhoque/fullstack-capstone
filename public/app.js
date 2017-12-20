const state = {
  projects: [],
  project: null
};
$(function() {
  renderPage();

  $("#jsForm").submit(function(event) {
    event.preventDefault();
    const newEntry = $("#jsForm").val();
    $("#jsForm").val("");
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
    postDataFromApi(newProject, ()=>{
      renderListItem();
    });
    console.log(state);
  });
  $("#jsEditForm").submit(function(event) {
    event.preventDefault();
    state.project.date = $("#edit-date").val();
    state.project.recentStatus = $("#edit-status").val();
    state.project.share = $("#edit-team").val();
    if(!state.project.statusHistory){
      state.project.statusHistory = [];
    }
    
    state.project.statusHistory.push(
    {
      'message':state.project.recentStatus,
      'date': state.project.date
    }
    );
    putDataFromApi(state.project, ()=>{
      renderListItem();
    });
    
    $("#container3").hide();
  });

  $("#jsForm").on('click', '#jsCancel', event => {
    $("#container1").show();
    $("#container2").hide();
 });

 $("#jsEditForm").on('click', '#jsCancel2', event => {
    $("#container1").show();
    $("#container3").hide();
 });

 //register and log-in
 $("#reg-link").click(function(){
    $("#signup-container").show();
    $("#container1").hide();
    $("#login-container").hide();
    $("#container4").hide();
    $("#container3").hide();
 });
 $("#log-link").click(function(){
    $("#signup-container").hide();
    $("#login-container").show();
    $("#container1").hide();
 });

$("#home-link").click(function(){
  renderPage();
});
//native JS method
let isLoggedIn = localStorage.getItem('token');
if (isLoggedIn){
  $("#reg-link").hide();
  $("#sign-out").show();
}
}); 
$("#sign-out").click(function(){
  localStorage.removeItem('token');//native js method
  location.reload();
});
  $("#jsRegister").click(function(){
    let username = $("#rName").val();
    console.log(username);
    let useremail = $("#rEmail").val();
    console.log(useremail);
    let userpass = $("#rPass").val();
    console.log(userpass);

    var newUser = {"email": useremail, "username": username, "password": userpass};
    $.ajax({     
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/register",
        data: JSON.stringify(newUser),
        success: function (data) {
            console.log(data);
            localStorage.setItem('token', data);
            location.reload();
        },
    });
    });



function handleDeleteClick(){
  console.log("handleclicked");
  console.log(state.project);
  deleteDataFromApi(state.project.id, state.project, ()=>{
      location.reload();
  });
}
function renderListItem() {
  $("#jsReport").html("");
  state.projects.forEach(addProject => {
    const newItem =
            `<tr>
            <td>${addProject.date}</td>
            <td>${addProject.project}</td>
            <td>${addProject.recentStatus}</td>
            <td>${addProject.pm}</td>
            <td>${addProject.release}</td>
            <td>${addProject.share}</td>
            
            <td>
            <button type= "button" class="btn waves-effect waves-light" id="jsEdit">edit</button>
            <button type= "button" class="btn waves-effect waves-light" id="jsDelete">Delete</button>
            <button type= "button" class="btn waves-effect waves-light" id="jsDetail">Detail</button>
            </td>
            </tr>`;
    const newItemJs = $(newItem);
    newItemJs.find("#jsEdit").click(function() {
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
    $("#jsReport").append(newItemJs);
  });
  $("#container1").show();
  $("#container2").hide();
}
  
// function renderStatusList() {
//   $("#jsProjectDetails").html("");
//   state.projects.forEach(addStatus => {
//     const newStatus 
//     `<tr>
//     <td>${addStatus.date}</td>
//     <td>${addStatus.recentStatus}</td>
//     <td>${addStatus.pm}</td>
//     <td>${addStatus.share}</td>
//     </tr>`;
//     const newStatusJs = $(newStatus);
//     newStatusJs.find("#jsDetail").click(function(){
//       $("#container1").hide();
//       $("#container2").hide();
//       $("#container3").hide();
//       $("#container4").hide();
  
//       state.project = addStatus;
//     });
//     $("#jsProjectDetails").append(newStatusJs);    
//   });

// }

function editProject() {
  $("#jsEditForm").on(click);
}

function renderPage() {
  $("#container1").show();
  $("#container2").hide();
  $("#container3").hide();
  $("#container4").hide();

  $("#signup-container").hide();
  $("#login-container").hide();

  $("#jsCreate").click(function() {
    $("#container1").hide();
    $("#container3").hide();
    $("#container2").show();
    
  });

  

  getDataFromApi(function(projects){
    state.projects= projects;
    renderListItem();
  });
}

function getDataFromApi(callback) {
  const settings = {
    url: "http://localhost:8080/projects",
    contentType: 'application/json',
    
    type: 'GET',
    success: callback
  };

  $.ajax(settings);
}

function postDataFromApi(projectData, callback) {
  const settings = {
    url: "http://localhost:8080/projects",
    
    contentType: 'application/json',
    data: JSON.stringify(projectData),
    type: 'POST',
    success: callback
  };

  $.ajax(settings);
}

function deleteDataFromApi(projectId, projectData, callback) {
  const settings = {
    url: "http://localhost:8080/projects/" + projectId,
    contentType: 'application/json',
    data: JSON.stringify(projectData), 
    type: 'DELETE',
    success: callback
  };

  $.ajax(settings);
}

function putDataFromApi(projectData, callback) {
  const settings = {
    url: "http://localhost:8080/projects/"+ projectData.id,
    contentType: 'application/json',
    data: JSON.stringify(projectData),
    type: 'PUT',
    success: callback
  };

  $.ajax(settings);
}