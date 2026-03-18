
// ROUTE: /AUTH
function create(req:any, res:any) {
  try {
    res.status(200).json({message: "sukses"})
  } catch (err) {
    res.status(400).json({message: err.message})
  }
}

// ROUTE: /STAFF
function getAllStaffs(req:any, res:any) {
  try {
    res.status(200).json({message: "sukses"})
  } catch (err) {
    res.status(404).json({message: err.message})
  }
}

function getStaffById(req:any, res:any) {
  try {
    res.status(200).json({message: "sukses"})
  } catch (err) {
    res.status(404).json({message: err.message})
  }
}

function deleteStaffById(req:any, res:any) {
  try {
    res.status(200).json({message: "sukses"})
  } catch (err) {
    res.status(404).json({message: err.message})
  }
}
