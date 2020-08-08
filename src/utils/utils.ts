export function invokeSaveAsDialog(file: any, fileName: any) {
  if (!file) {
    throw Error("Blob object is required.");
  }

  if (!file.type) {
    try {
      file.type = "video/webm";
    } catch (e) {
    }
  }

  var fileExtension = (file.type || "video/webm").split("/")[1];

  if (fileName && fileName.indexOf(".") !== -1) {
    var splitted = fileName.split(".");
    fileName = splitted[0];
    fileExtension = splitted[1];
  }

  var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + "." + fileExtension;

  if (typeof navigator.msSaveOrOpenBlob !== "undefined") {
    return navigator.msSaveOrOpenBlob(file, fileFullName);
  } else if (typeof navigator.msSaveBlob !== "undefined") {
    return navigator.msSaveBlob(file, fileFullName);
  }

  var hyperlink = document.createElement("a");
  hyperlink.href = URL.createObjectURL(file);
  hyperlink.download = fileFullName;

  // @ts-ignore
  hyperlink.style = "display:none;opacity:0;color:transparent;";
  (document.body || document.documentElement).appendChild(hyperlink);

  if (typeof hyperlink.click === "function") {
    hyperlink.click();
  } else {
    hyperlink.target = "_blank";
    hyperlink.dispatchEvent(new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true
    }));
  }

  URL.revokeObjectURL(hyperlink.href);
}
