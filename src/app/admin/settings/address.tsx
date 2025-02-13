"use client";

import { Input } from "@/components/input";

export function Address() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Input
        aria-label="Street Address"
        name="address"
        placeholder="Street Address"
        defaultValue="147 Catalyst Ave"
        className="col-span-2"
      />
      <Input
        aria-label="City"
        name="city"
        placeholder="City"
        defaultValue="Toronto"
        className="col-span-2"
      />
      {/* <Listbox
        aria-label="Region"
        name="region"
        placeholder="Region"
        defaultValue="Ontario"
      >
        {country.regions.map((region) => (
          <ListboxOption key={region} value={region}>
            <ListboxLabel>{region}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox> */}
      <Input
        aria-label="Postal code"
        name="postal_code"
        placeholder="Postal Code"
        defaultValue="A1A 1A1"
      />
      {/* <Listbox
        aria-label="Country"
        name="country"
        placeholder="Country"
        by="code"
        value={country}
        onChange={(country) => setCountry(country)}
        className="col-span-2"
      >
        {countries.map((country) => (
          <ListboxOption key={country.code} value={country}>
            <Image
              width={100}
              height={100}
              className="w-5 sm:w-4"
              src={country.flagUrl}
              alt=""
            />
            <ListboxLabel>{country.name}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox> */}
    </div>
  );
}
