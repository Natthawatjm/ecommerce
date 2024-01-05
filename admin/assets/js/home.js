function render() {
    //get
    $.ajax({
        method: 'get',
        url: 'http://localhost:3000/api/getaccount',
        success: (response) => {
            console.log('good', response)
            if(response.RespCode == 200) {
                data = response.Result;
                if(data.length > 0) {
                    var html = '';
                    for (let i = 0; i < data.length; i++) {
                        html += `
                                     <tr>
                                            <td>${i+1}</td>
                                            <td>${data[i].username}</td>
                                            <td>${data[i].email}</td>
                                            <td class="text-right">${data[i].phone}</td>
                                            <td class="text-right">${data[i].address}</td>
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


