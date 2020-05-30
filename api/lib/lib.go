package lib

func CheckString(target string, fallback string) string {
	if target == `` {
		return fallback
	}
	return target
}
