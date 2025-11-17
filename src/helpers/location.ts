export function getCurrentLocation(): Promise<{
  lat: number;
  lng: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true }
    );
  });
}

export const getAddressFromLatLng = (lat: number, lng: number) => {
  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve("Alamat tidak ditemukan");
        }
      } else {
        reject("Geocoder gagal: " + status);
      }
    });
  });
};
