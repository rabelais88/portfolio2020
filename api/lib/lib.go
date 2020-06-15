package lib

func CheckString(target string, fallback string) string {
	if target == `` {
		return fallback
	}
	return target
}

func CheckInt(target int, fallback int) int {
	if target == 0 {
		return fallback
	}
	return target
}
