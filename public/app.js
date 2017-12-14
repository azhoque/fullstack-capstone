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
    $("#container3").hide();
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
 });
 $("#log-link").click(function(){
    $("#signup-container").hide();
    $("#login-container").show();
    $("#container1").hide();
 });
 
//  function deleteProject(itemIndex){
//     state.project.splice(itemIndex, 1);
//  }
//  function handleDeleteClick(){
//      $("#jsEditForm").on('click', '#jsDelete', event => {
//         const deleteItem = state.projects.filter((project) =>{
//             return project != deleteProject 
//         });
        
//      });
//  }

}); 
function renderListItem() {
  $("#jsReport").html("");
  state.projects.forEach(addProject => {
    const newItem = `<div>
            <ul>
            <li>Date:${addProject.date}</li>
            <li>Project Name:${addProject.project}</li>
            <li>Project Status:${addProject.recentStatus}</li>
            <li>Project Manager:${addProject.pm}</li>
            <li>Release Date:${addProject.release}</li>
            <li>Team:${addProject.share}</li>
            <li>
            <button type="button" id="jsEdit">Edit</button>
            <button type= "button" id="jsDelete">Delete</button>
            <button type= "button" id="jsDetail">Project Detail</button>
            </li>
            </ul>
        </div>`;
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

    $("#jsReport").append(newItemJs);
  });
  $("#container1").show();
  $("#container2").hide();
}
function renderStatusList() {
  $("#jsProjectDetails").html("");
  state.projects.forEach(addStatus => {
    const newStatus = `<div>
            <ul>
            <li>Date:${addStatus.date}</li>
            <li>Status History:${addStatus.statusHistory}</li>
            <li>
            <button type="button" id="jsBack">Back</button>
            </li>
            </ul>
        </div>`;
    const newStatusJs = $(newStatus);
    newStatusJs.find("#jsDetail").click(function(){
      $("#container1").hide();
      $("#container2").hide();
      $("#container3").hide();
      $("#container4").show();
      state.project = addStatus;
    });
    $("#jsProjectDetails").append(newStatusJs);    
  });

}

function editProject() {
  $("#jsEditForm").on(click);
}

function renderPage() {
  $("#container1").show();
  $("#container2").hide();
  $("#container3").hide();
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

function deleteDataFromApi(projectData, callback) {
  const settings = {
    url: "http://localhost:8080/projects",
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