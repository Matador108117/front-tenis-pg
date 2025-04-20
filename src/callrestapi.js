var url = "https://pg-restapi-tenis.onrender.com/api/sneakers";
var allSneakers = [];
function postSneaker() {
  var mysneaker = {
    name: $('#name').val(),
    price: $('#price').val(),
    description: $('#description').val(),
    brand: $('#brand').val(),
    size: $('#size').val(),
    image: $('#image').val(),
    color: $('#color').val(),
    sex: $('#sex').val()
  };

  $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(mysneaker),
    success: function (data) {
      Swal.fire('Sneaker added succefully', '', 'success');
      getSneakers();
      closeModal();
    }
  });
}
/*
function getUsers() {
    $.getJSON(url, function(json) {
        let users = json.users;
        let html = `<table>
          <tr>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Edad</th><th>Comentarios</th><th>Acciones</th>
          </tr>`;

        users.forEach(user => {
            html += `<tr>
              <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.age}</td>
              <td>${user.comments}</td>
              <td class="accions">
                <button class="btn-edit" onclick="confirmUpdate(${user.id})">
                  <i class="fas fa-edit"></i><span>Editar</span>
                </button>
                <button class="btn-delete" onclick="confirmDelete(${user.id})">
                  <i class="fas fa-trash-alt"></i><span>Eliminar</span>
                </button>
              </td>
            </tr>`;
        });

        html += '</table>';
        $('#resultado').html(html);
    });
}
*/
async function searchSneaker() {
  $('#spinner-container').show();
  $('#resultado').empty();

  const input = $('#text').val().trim();

  if (input === '') {
    Swal.fire('Empty input ', 'Please type somthing to search', 'warning');
    $('#spinner-container').hide();
    return;
  }

  let sneakerData = [];

  if (/^\d+$/.test(input)) {
    // Búsqueda por ID
    try {
      const response = await fetch(`${url}/${input}`);
      if (!response.ok) throw new Error('Sneaker not found');

      const data = await response.json();
      const sneaker = data.sneaker; // 
      sneakerData.push(sneaker);
    } catch (error) {
      console.error(error);
      Swal.fire('Not found', 'No Sneaker with this ID was found', 'error');
      $('#spinner-container').hide();
      return;
    }

  } else {
    // Búsqueda por nombre
    try {
      const response = await fetch(url);
      const data = await response.json();
      const sneakers = data.sneakers;

      sneakerData = sneakers.filter(sneaker =>
        sneaker.name.toLowerCase().includes(input.toLowerCase())
      );

      if (sneakerData.length === 0) {
        Swal.fire('Not found', 'No sneaker with this name was found.', 'info');
        $('#spinner-container').hide();
        return;
      }

    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Oops, Has been a trouble to search sneakers.', 'error');
      $('#spinner-container').hide();
      return;
    }
  }

  // Construcción de la tabla
  let html = `<table>
  <tr>
    <th>ID</th><th>Name</th><th>Price</th><th>Description</th><th>Brand</th><th>Size</th><th>Color</th><th>Sex</th><th>Image</th><th>Actions</th>
  </tr>`;

  sneakerData.forEach(sneaker => {
    html+=`<tr>
              <td>${sneaker.id}</td>
              <td>${sneaker.name}</td>
              <td>${sneaker.price}</td>
              <td>${sneaker.description}</td>
              <td>${sneaker.brand}</td>
              <td>${sneaker.size}</td>
              <td>${sneaker.color}</td>
              <td>${sneaker.sex}</td>
             <td><img src="${sneaker.image}" alt="${sneaker.name}" class="sneaker-img" onclick="showImagePreview('${sneaker.image}', '${sneaker.name}')"/></td> 
              <td class="accions">
                <button class="btn-edit" onclick="handleEdit(${sneaker.id})" title="Edit">
                <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-delete" onclick="confirmDelete(${sneaker.id})" title="Delete">
                <i class="bi bi-trash"></i>
              </button> 
              </td>
            </tr>`;
  });

  html += `</table>`;

  $('#resultado').html(html);
  $('#spinner-container').hide();
}



function getSneaker(id) {
  $.getJSON(url + '/' + id, function (json) {
    let mysneaker = {
      name: $('#name').val(),
      price: $('#price').val(),
      description: $('#description').val(),
      brand: $('#brand').val(),
      size: $('#size').val(),
      image: $('#image').val(),
      color: $('#color').val(),
      sex: $('#sex').val()
    };
    return mysneaker;
  });
}
function getSneaker(id, callback) {
  $.getJSON(url + '/' + id, function (json) {
    let sneaker = json.sneaker;
    callback(sneaker);
  });
}


function handleEdit(id) {
  getSneaker(id, function (sneaker) {
    openModal('edit', sneaker);
  });
}
function getSneakers() {
  $('#spinner-container').show();
  $('#resultado').empty();

  $.getJSON(url)
    .done(function (json) {
      allSneakers = json.sneakers;
      if (allSneakers) {
        renderSneakers(allSneakers);
      }
    })
    .fail(function () {
      $('#spinner-container').hide();
      $('#resultado').html('<p style="color:red; text-align:center;">Error to load sneakers.</p>');
    });
}

function renderSneakers(allSneakers) {
  let html = `<table>
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Description</th><th>Brand</th><th>Size</th><th>Color</th><th>Sex</th><th>Image</th><th>Actions</th>
          </tr>`;

  allSneakers.forEach(sneaker => {
    html += `<tr>
              <td>${sneaker.id}</td>
              <td>${sneaker.name}</td>
              <td>$${sneaker.price}</td>
              <td class="desc-text">${sneaker.description}</td>
              <td>${sneaker.brand}</td>
              <td>${sneaker.size}</td>
              <td>${sneaker.color}</td>
              <td>${sneaker.sex}</td>
              <td><img src="${sneaker.image}" alt="${sneaker.name}" class="sneaker-img" onclick="showImagePreview('${sneaker.image}', '${sneaker.name}')"/></td>
              <td class="accions">
                <button class="btn-edit" onclick="handleEdit(${sneaker.id})" title="Edit">
                <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-delete" onclick="confirmDelete(${sneaker.id})" title="Delete">
                <i class="bi bi-trash"></i>
              </button> 
              </td>
            </tr>`;
  });

  html += '</table>';
  $('#resultado').html(html);
  $('#spinner-container').hide();
}
function showImagePreview(url, name) {
  Swal.fire({
    title: name,
    imageUrl: url,
    imageAlt: name,
    imageWidth: 400,
    imageHeight: 'auto',
    showCloseButton: true,
    confirmButtonText: 'Cerrar',
    background: '#fff',
    color: '#1A2930'
  });
}



function sortSneakers() {
  const sortBy = document.getElementById("sortSelect").value;

  const sortedSneakers = [...allSneakers]; // copia para no afectar el original

  switch (sortBy) {
    case "id-asc":
      sortedSneakers.sort((a, b) => a.id - b.id);
      break;
    case "id-desc":
      sortedSneakers.sort((a, b) => b.id - a.id);
      break;
    case "name-asc":
      sortedSneakers.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sortedSneakers.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  renderSneakers(sortedSneakers);
}

function confirmDelete(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: "this action cannot be undone",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#F73E7E',
    cancelButtonColor: '#1A2930',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteSneaker(id);
    }
  });
}

function deleteSneaker(id) {
  $.ajax({
    url: url + '/' + id,
    type: 'delete',
    success: function () {
      Swal.fire(' User deleted ', '', 'success');
      getSneakers();
    }
  });
}
/*
function confirmUpdate(id) {
  Swal.fire({
    title: '¿Update this sneaker?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#000000',
    cancelButtonColor: '#F73E7E',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      updateSneaker(id);
      closeModal();
    }
  });
}

function updateSneaker(id) {
  const mysneaker = {
    name: $('#name').val(),
    price: $('#price').val(),
    description: $('#description').val(),
    brand: $('#brand').val(),
    size: $('#size').val(),
    image: $('#image').val(),
    color: $('#color').val(),
    sex: $('#sex').val()
  };

  $.ajax({
    url: url + '/' + id,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(mysneaker),
    success: function () {
      Swal.fire('Sneaker updated!', '', 'success');
      getSneakers();
    }
  });
}
*/

function confirmUpdate(id) {
  const form = document.getElementById("employeeForm");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  Swal.fire({
    title: '¿would you like to update this user?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#000000',
    cancelButtonColor: '#F73E7E',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      updateSneaker();
      closeModal();
    }
  });
}


function updateSneaker() {
  var id = $('#sneakerId').val();
  let mysneaker = {
    name: $('#name').val(),
    price: $('#price').val(),
    description: $('#description').val(),
    brand: $('#brand').val(),
    size: $('#size').val(),
    image: $('#image').val(),
    color: $('#color').val(),
    sex: $('#sex').val()
  };

  $.ajax({
    url: url + '/' + id,
    type: 'put',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(mysneaker),
    success: function () {
      Swal.fire('Sneaker updated', '', 'success');
      getSneakers();
    }
  });
} 
