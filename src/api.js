import reqwest from 'reqwest'

const FormUrlencodedUtf8ContentType = 'application/x-www-form-urlencoded; charset=utf-8'

export default {

  // 载入文档
  loadDoc(name, f_success, f_fail, f_error) {
    reqwest({
      url: window.basePath + '/rest/doc/load',
      method: 'get',
      data: {
        name,
      },
      success: function (resp) {
        if (resp.code === '0') {
          if (f_success) {
            f_success(resp)
          }
        } else {
          if (f_fail) {
            f_fail(resp)
          }
        }
      },
      error: function (err) {
        if (f_error) {
          f_error(err)
        }
      },
    })
  },

  // 保存文档
  saveDoc(name, doc, f_success, f_fail, f_error) {
    reqwest({
      url: window.basePath + '/rest/doc/save',
      method: 'post',
      contentType: FormUrlencodedUtf8ContentType,
      data: {
        name,
        doc,
      },
      success: function (resp) {
        if (resp.code === '0') {
          if (f_success) {
            f_success(resp)
          }
        } else {
          if (f_fail) {
            f_fail(resp)
          }
        }
      },
      error: function (err) {
        if (f_error) {
          f_error(err)
        }
      },
    })
  },
}