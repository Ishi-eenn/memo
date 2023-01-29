const editModal = new bootstrap.Modal(document.getElementById('editModal'))
const addModal = new bootstrap.Modal(document.getElementById('id-add-modal'))
const titleInAddModal = document.getElementById("id-add-modal-title")
const bodyInAddModal = document.getElementById("id-add-modal-body")
const memoList = document.getElementById("id-memo-list")
const validationErrorInAddModal = document.getElementById("id-validation-error-in-add-modal")
const validationErrorInEditModal = document.getElementById("id-validation-error-in-edit-modal")
const memoIdInEditModal = document.getElementById("id-memo-id")
const titleInEditModal = document.getElementById("id-modal-title")
const bodyInEditModal = document.getElementById("id-modal-body")
const checkboxes = document.getElementsByClassName(getCheckboxClass())

function getIdTitleInMemoList(memoId) {
  return document.getElementById(createTitleInMemoListId(memoId))
}

function createTitleInMemoListId(memoId) {
  return "id-title-in-list-" + memoId
}

function createUpdatedAtId(memoId) {
  return "id-updated-at-" + memoId
}

function getIdBodyInlist(memoId) {
  return document.getElementById(createBodyInListId(memoId))
}

function createBodyInListId(memoId) {
  return "id-body-in-list-" + memoId
}

function getCheckboxClass() {
  return "class-checkbox"
}

function validateMemo(title, body, errorHTMLElement, memoId) {
  errorHTMLElement.innerHTML = ""
  if (title.length < 1 || title.length > 30) {
    errorHTMLElement.innerHTML = "タイトルの文字数は1文字以上30文字以下にしてください。<br>"
  }

  if (body.length < 1 || body.length > 100) {
    errorHTMLElement.innerHTML = errorHTMLElement.innerHTML + "本文の文字数は1文字以上100文字以下にしてください。<br>"
  }

  if (memoList.children.length > 0) {
    Array.from(memoList.children).forEach((tr) => {
      if (tr.id == memoId) {
        return
      }

      const t = getIdTitleInMemoList(tr.id).innerText
      if (title == t) {
        errorHTMLElement.innerHTML = errorHTMLElement.innerHTML + "すでに登録済みのタイトルです。<br>"
      }
    })
  }

  if (errorHTMLElement.innerHTML.length > 0) {
    errorHTMLElement.style.display = ""
    return false
  }

  return true
}

const addButtonInModal = document.getElementById("id-add-modal-button")
addButtonInModal.addEventListener("click", (event) => {
  const title = titleInAddModal.value
  const body = bodyInAddModal.value

  if (validateMemo(title, body, validationErrorInAddModal, "0") == false) {
    return
  }

  const now = dayjs()
  const createdAt = now.format("YYYY-MM-DD HH:mm:ss")
  const updatedAt = "なし"
  const memoId = now.valueOf()

  const tr = document.createElement("tr")
  tr.setAttribute("id", memoId)

  const editButtonId = "id-edit-button-" + memoId
  const idTitleInList = createTitleInMemoListId(memoId)
  const updatedAtId = createUpdatedAtId(memoId)

  tr.innerHTML = '<td><input class="' + getCheckboxClass() + '" data-memo-id="' + memoId + '" type="checkbox"></td><td id="' + idTitleInList + '">' + title + '</td><td>' + createdAt + '</td><td id="' + updatedAtId + '">' + updatedAt + '</td><td><button type="button" data-memo-id="' + memoId + '" id="' + editButtonId + '" class="btn btn-primary">確認</button></td>'
  memoList.appendChild(tr)

  const inputForBody = document.createElement("input")
  inputForBody.setAttribute("id", createBodyInListId(memoId))
  inputForBody.setAttribute("type", "hidden")
  inputForBody.value = body
  tr.appendChild(inputForBody)

  const editButton = document.getElementById(editButtonId)
  editButton.addEventListener("click", (event) => {
    validationErrorInEditModal.style.display = "none"
    validationErrorInEditModal.innerHTML = ""

    const memoId = event.currentTarget.dataset.memoId
    memoIdInEditModal.value = memoId

    const title = getIdTitleInMemoList(memoId).innerText
    titleInEditModal.value = title

    const body = getIdBodyInlist(memoId).value
    bodyInEditModal.value = body

    editModal.show()
  })
  addModal.hide()
})

const addButton = document.getElementById("id-add-button")
addButton.addEventListener("click", (event) => {
  titleInAddModal.value = ""
  bodyInAddModal.value = ""
  addModal.show()

  validationErrorInAddModal.style.display = "none"
  validationErrorInAddModal.innerHTML = ""
})

const deleteButton = document.getElementById("id-delete-button")
deleteButton.addEventListener("click", (event) => {
  Array.from(checkboxes).forEach((checkbox) => {
    if (checkbox.checked == false) {
      return false
    }

    const memoId = checkbox.dataset.memoId
    document.getElementById(memoId).remove()
  })
})

const deleteAllMemos = document.getElementById("id-delete-all-memos")
deleteAllMemos.addEventListener("change", (event) => {
  if (checkboxes.length == 0) {
    return
  }

  Array.from(checkboxes).forEach((checkbox) => {
    if (deleteAllMemos.checked == true) {
      checkbox.checked = true
    } else {
      checkbox.checked = false
    }
  })
})

const updateButton = document.getElementById("id-update-button")
updateButton.addEventListener("click", (event) => {
  const memoId = memoIdInEditModal.value
  const title = titleInEditModal.value
  const body = bodyInEditModal.value

  if (validateMemo(title, body, validationErrorInEditModal, memoId) == false) {
    return
  }

  getIdTitleInMemoList(memoId).innerText = title

  getIdBodyInlist(memoId).value = body

  document.getElementById(createUpdatedAtId(memoId)).innerText = dayjs().format("YYYY-MM-DD HH:mm:ss")

  editModal.hide()
})