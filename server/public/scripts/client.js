$(document).ready(function() {
  console.log('JS Sourced');
  addButtonListeners();
});

function addButtonListeners () {
  $('#registerOwner').on('click', function() {
    $.ajax({
      url: "/owner",
      type: "POST",
      data: newOwner,
      success: function(response) {
        console.log('ajax response: ', response);
        // Refresh the data so that it reflects the most current database
        refreshTable();
      }
    }); // end of AJAX POST
  });// end of even listener

  $('#registerPet').on('click', function() {
    $.ajax({
      url: "/pet",
      type: "POST",
      data: newPet,
      success: function(response) {
        console.log('ajax response: ', response);
        // Refresh the data so that it reflects the most current database
        refreshTable();
      }
    }); // end of AJAX POST
  });// end of even listener

  $("#viewTasks").on('click', '.deleteBtn', function(){
    // Select the object that was stored in the data for this task.
    // It includes all of the data that was sent from the database for this row.
    var thisPetData = $(this).parent().parent().data().task;

    // Send AJAX DELETE request to delete a row from the database
    $.ajax({
       url: '/pet/' + thisPetData.user_id,
       type: 'DELETE',
       success: function(response) {
         console.log('tasks deleted');
         refreshTable();
       }
    }); // end of ajax request
  }); // end of delete button listener

}

function refreshTable() {
  // Clears out the previous tasks from the table element
  $('#viewVisits').empty();

  // Sends a GET request for the most current tasks in the database.
  $.ajax({
    url: '/pet',
    type: 'GET',
    success: function(response){
      console.log(response);
      var tasks = response.tasks;
      for (i=0; i<tasks.length; i++) {
        var task = tasks[i];
        $tr = $('<tr class="' + task.task_complete + '"></tr>');
        $tr.data('task', task);
        $tr.append('<td>' + task.description + '</td>');
        $tr.append('<td>' + task.location + '</td>');
        $tr.append('<td>' + task.task_complete + '</td>');
        $tr.append('<td><button type="button" class="completeBtn">complete</button></td>');
        $tr.append('<td><button type="button" class="deleteBtn">delete</button></td>');
        $('#viewTasks').append($tr);
      }
    }
  });
}
