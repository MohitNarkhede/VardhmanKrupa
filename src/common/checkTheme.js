import themes from './Colors';
export function checkTheme(theme) {
    if (theme == "light") {
        return themes.light;
    } else if (theme == "red") {
        return themes.red;
    } else if (theme == "black") {
        return themes.black;
    } else if (theme == "dark") {
        return themes.dark;
    }
}