import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js'
let productModal = null
let delproductModal = null
const app = createApp({
  data () {
    return {
      tempProduct: {},
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'clothes',
      isNew: false,
      modal: '',
      products: []
    }
  },
  methods: {
    openModal (type, product) {
      if (type === 'new') {
        this.isNew = true
        this.modal = 'product'
        productModal.show()
        this.tempProduct = {}
      } else if (type === 'del') {
        this.isNew = false
        this.modal = 'del'
        delproductModal.show()
        this.tempProduct = { ...product }
      } else if (type === 'edit') {
        this.isNew = false
        this.modal = 'product'
        this.tempProduct = { ...product }
        productModal.show()
      }
    },
    closeModal () {
      if (this.modal === 'product') { productModal.hide() } else if (this.modal === 'del') { delproductModal.hide() }
    },
    checkLogin () {
      const url = `${this.apiUrl}/api/user/check`
      axios.post(url)
        .then((res) => {
          if (!res.data.success) {
            alert('請重新登入')
            window.location = 'index.html'
          } else {
            this.getData()
          }
        })
        .catch((err) => {
          console.dir(err.data)
          alert('驗證失敗，請重新登入')
          window.location = 'index.html'
        })
    },
    getData () {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`
      axios.get(url)
        .then((res) => {
          this.products = res.data.products
        })
        .catch((err) => {
          console.dir(err.data)
        })
    },
    addProduct () {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`
      axios.post(url, { data: this.tempProduct })
        .then(res => {
          this.getData()
          productModal.hide()
          alert(res.data.message)
        }).catch(err => {
          console.dir(err)
        })
    },
    updateProduct () {
      console.log(this.tempProduct)
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
      axios.put(url, { data: this.tempProduct })
        .then(res => {
          this.getData()
          productModal.hide()
          alert(res.data.message)
        }).catch(err => {
          console.dir(err)
        })
    },
    delProduct () {
      console.log(this.tempProduct)
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
      axios.delete(url)
        .then(res => {
          this.getData()
          delproductModal.hide()
          alert(res.data.message)
        }).catch(err => {
          console.dir(err)
        })
    },
    createImagesUrl () {
      this.tempProduct.imagesUrl = []
      this.tempProduct.imagesUrl.push('')
    },
    logout () {
      const url = `${this.apiUrl}/logout`
      axios.post(url)
        .then((res) => {
          Cookies.remove('hexToken')
          alert('登出成功')
          window.location = 'index.html'
        }).catch((err) => {
          console.dir(err.data)
        })
    }
  },
  mounted () {
    // 取出 Token
    productModal = new bootstrap.Modal(document.querySelector('#productModal'), { keyboard: false })
    delproductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), { keyboard: false })
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    axios.defaults.headers.common.Authorization = token
    this.checkLogin()
  }
})
app.mount('#app')
