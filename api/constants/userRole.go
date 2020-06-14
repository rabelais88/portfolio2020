package constants

const (
	NO_ROLE = "NO_ROLE"
	ADMIN   = "ADMIN"
)

type _userRole struct {
	NO_ROLE string
	ADMIN   string
}

var USER_ROLE = &_userRole{
	NO_ROLE: NO_ROLE,
	ADMIN:   ADMIN,
}
