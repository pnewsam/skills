BINARY := skills-cli
MODULE := github.com/paulnewsam/skills/cli

.PHONY: build install clean

build:
	go build -o $(BINARY) ./cmd/skills

install:
	go install ./cmd/skills

clean:
	rm -f $(BINARY)
