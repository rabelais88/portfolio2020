package lib

import "strconv"

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

func StringToInt64(target string, fallback int64) int64 {
	if target == "" {
		return fallback
	}
	n, err := strconv.ParseInt(target, 10, 64)
	if err != nil {
		return fallback
	}
	return n
}
