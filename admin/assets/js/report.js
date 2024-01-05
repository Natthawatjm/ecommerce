function render() {
    //get
    $.ajax({
        method: 'get',
        url: 'http://localhost:3000/api/getreport',
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
                                            <td>${data[i].name}</td>
                                            <td>${data[i].pice}</td>
                                            <td class="text-right">${data[i].quantity}</td>
                                            <td class="text-right">${data[i].quantity * data[i].pice}.00</td>
      
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

$('.btnreport').click( ()=>{
    document.body.innerHTML  = document.all.item("report").innerHTML;
    window.print();
    window.location.reload();
})