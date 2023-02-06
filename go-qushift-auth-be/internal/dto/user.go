package dto

type UserDto struct {
	UserId   string `json:"user_id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// UserWithToken Find user query
type UserWithToken struct {
	User  *UserDto `json:"user"`
	Token string   `json:"token"`
}
