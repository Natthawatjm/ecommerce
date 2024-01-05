function render() {
    //get
    $.ajax({
        method: 'get',
        url: 'http://localhost:3000/api/getaccount',
        success: (response) => {
            console.log('good', response)
            if (response.RespCode == 200) {
                data = response.Result;
                if (data.length > 0) {
                    var html = '';
                    for (let i = 0; i < data.length; i++) {
                        html += `
                                     <tr>
                                            <td>${i + 1}</td>
                                            <td>${data[i].username}</td>
                                            <td>${data[i].email}</td>
                                            <td class="text-right">${data[i].phone}</td>
                                            <td class="text-right">${data[i].address}</td>
                                            
                                            <td>
                                            <div class="table-data-feature">
                                                <button class="item" data-toggle="tooltip" data-placement="top" title="Send">
                                                    <i class="zmdi zmdi-mail-send"></i>
                                                </button>
                                                <button onclick="editmovie(${data[i].id}, ${i})" type="button" class="item" data-bs-toggle="modal" data-bs-target="#modaledit" title="Edit">
                                                    <i class="zmdi zmdi-edit"></i>
                                                </button>
                                                <button onclick="deletemovie(${data[i].id}, ${i}, '${data[i].username}')"class="item" data-toggle="tooltip" data-placement="top" title="Delete">
                                                    <i class="zmdi zmdi-delete"></i>
                                                </button>
                                                <button class="item" data-toggle="tooltip" data-placement="top" title="More">
                                                    <i class="zmdi zmdi-more"></i>
                                                </button>
                                            </div>
                                            </td>
                                    </tr>
                        `;
                    }
                    $("#table").html(html)
                }
            }
        }, error: (err) => {
            console.log('bad', err)
        }
    })
}

render();


function save() {
    $.ajax({
        method: 'post',
        url: 'http://localhost:3000/api/register',
        data: {
            username: $("#username").val(),
            password: $("#password").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            address: $("#address").val(),
        }, success: (response) => {
            console.log('good', response)
            if(response.RespCode == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Add User successfully'
                })
                $("#closeaddmodal").trigger('click')
                render();
            }
        }, error: (err) => {
            console.log('bad', err)
        }
    })
}


function deletemovie(mid, index, name) {
    Swal.fire({
        icon: "warning",
        title: 'Are you sure to delete '+ name +'?',
        showConfirmButton: false,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `DELETE`,
    }).then((result) => {
        if (result.isDenied) {
            $.ajax({
                method: "delete",
                url: 'http://localhost:3000/api/deletemoviebyid',
                data: {
                    id: mid
                }, success: (response) => {
                    console.log('good', response)
                    if(response.RespCode == 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Delete successfully'
                        })
                        render();
                    }
                }, error: (err) => {
                    console.log('bad', err)
                }
            })
        }
    })
}

function editmovie(mid, index) {
    $("#usernames").val(data[index].username)
    $("#passwords").val(data[index].password)
    $("#emails").val(data[index].email)
    $("#phones").val(data[index].phone)
    $("#addresss").val(data[index].address)
    movieid = mid;
}

function update() {
    $.ajax({
        method: 'put',
        url: 'http://localhost:3000/api/update',
        data: {
            id: parseInt(movieid),
            username: $("#usernames").val(),
            password: $("#passwords").val(),
            email: $("#emails").val(),
            phone: $("#phones").val(),
            address: $("#addresss").val()
        }, success: (response) => {
            console.log('good', response)
            if(response.RespCode == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Update successfully'
                })
                $("#closeeditmodal").trigger('click')
                render();
            }
        }, error: (err) => {
            console.log('bad', err)
        }
    })
}