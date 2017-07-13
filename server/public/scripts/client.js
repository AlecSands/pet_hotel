$(document).ready(function() {
  console.log('JS Sourced');
  addButtonListeners();
  refreshTable();
});

function addButtonListeners () {
  $('#registerOwner').on('click', function(event) {
    event.preventDefault();
    console.log('You clicked the register owner button!');

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

  $('#registerPet').on('click', function(event) {
    event.preventDefault();

    console.log('You clicked the register pet button!');

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

  $("#petContainer").on('click', '.deleteBtn', function(){
    console.log('You clicked the delete button!');
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
  $('#petContainer').empty();

  // Sends a GET request for the most current tasks in the database.
  $.ajax({
    url: '/pet',
    type: 'GET',
    success: function(response){
      console.log(response);
      var pets = response;
      for (i=0; i<pets.length; i++) {
        var pet = pets[i];
        $tr = $('<tr></tr>');
        $tr.data('task', task);
        $tr.append('<td>' + pet.ownerName + '</td>');
        $tr.append('<td>' + pet.petName + '</td>');
        $tr.append('<td>' + pet.petBreed + '</td>');
        $tr.append('<td>' + pet.petColor + '</td>');
        $tr.append('<td><button type="button" class="updateBtn btn btn-info">Update</button></td>');
        $tr.append('<td><button type="button" class="deleteBtn btn btn-info">delete</button></td>');
        $tr.append('<td><button type="button" class="checkPet">Check' + pet.checkIn + '</button></td>');
        $('#petContainer').append($tr);
      }
    }
  });
}
