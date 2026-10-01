# Notes

## Snippets

- https://github.com/Netflix/photon/blob/d5fe1494adc83000ef744d5c01bd714a778fac00/src/main/java/com/netflix/imflibrary/IMFConstraints.java
- https://github.com/tgowon/effective-java-3e-notes/blob/6490a7e302c2ce27a92d0b6fd339745fe70d7d00/items/item-04-enforce-non-instantiability-with-a-private-constructor.md

```java
/**
 * This class consists exclusively of static methods that help verify the compliance of OP1A-conformant
 * (see st378:2004) MXF header partition as well as MXF partition packs (see st377-1:2011)
 * with st2067-5:2013
 */
public final class IMFConstraints
{
    private static final String IMF_ESSENCE_EXCEPTION_PREFIX = "IMF Essence Component check: ";
    private static final byte[] IMF_CHANNEL_ASSIGNMENT_UL = {0x06, 0x0e, 0x2b, 0x34, 0x04, 0x01, 0x01, 0x0d, 0x04, 0x02, 0x02, 0x10, 0x04, 0x01, 0x00, 0x00};
    public static final String IMSC1TextProfileDesignator = "http://www.w3.org/ns/ttml/profile/imsc1/text";
    public static final String IMSC1ImageProfileDesignator = "http://www.w3.org/ns/ttml/profile/imsc1/image";
    // Timed Text profile designators per SMPTE ST 2067-2:2020, section 5.4.2
    private static final String[] IMSC1TextProfileDesignators2020 = {IMSC1TextProfileDesignator, "http://www.w3.org/ns/ttml/profile/imsc1.1/text", "urn:ebu:tt:distribution:2014-01", "urn:ebu:tt:distribution:2018-04", "http://www.w3.org/ns/ttml/profile/sdp-us", "https://www.netflix.com/ns/imsc1.1/text/1"};
    private static final String[] IMSC1ImageProfileDesignators2020 = {IMSC1ImageProfileDesignator, "http://www.w3.org/ns/ttml/profile/imsc1.1/image"};
    public static final String IMSC1ImageResourceMimeMediaType = "image/png";
    public static final String IMSC1FontResourceMimeMediaType = "application/x-font-opentype";
    //to prevent instantiation
    private IMFConstraints()
    {}
    // ...
}
```
