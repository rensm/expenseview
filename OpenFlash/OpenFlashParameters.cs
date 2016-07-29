using System;
using System.Collections.Generic;

namespace OpenFlash
{
    [Serializable]
    public class OpenFlashParameters
    {
        public OpenFlashParameters()
        {
            Name = "chart";
            Width = 750;
            Height = 260;
            Background = "#FFFFFF"; // White
        }

        public string FlashFileUrl { get; set; }

        public string Name { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public string Background { get; set; }
    }
}